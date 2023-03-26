
export interface TypeMapping<FromType, ToType> {
  fromName: string
  toName: string
  to: (from: FromType) => ToType
  from: (to: ToType) => FromType
}

export interface TypeDefinition {
  name: string
  test: (value: unknown) => boolean
}

export interface Graph {
  // from
  [key: string]: {
    // to
    [key: string]: <ThisType, DestinationType>(from: ThisType) => DestinationType
  }
}

export class TypeGraph {
  #structure: Graph = {}
  #definitions: TypeDefinition[] = []
  addTypeDefinition(definition: TypeDefinition) {
    this.#definitions.push(definition)
  }
  addMapping<FromType extends unknown, ToType extends unknown>(mapping: TypeMapping<FromType, ToType>) {
    if (!this.#structure[mapping.fromName]) {
      this.#structure[mapping.fromName] = {}
    }
    if (!this.#structure[mapping.fromName][mapping.toName]) {
      this.#structure[mapping.fromName][mapping.toName] = mapping.to as any
    }
  
    if (!this.#structure[mapping.toName]) {
      this.#structure[mapping.toName] = {}
    }
    if (!this.#structure[mapping.toName][mapping.fromName]) {
      this.#structure[mapping.toName][mapping.fromName] = mapping.from as any
    }
  
    // throw new Error(`Redundant mapping from ${mapping.fromName} to ${mapping.toName}`)
  }
  getTypeName(source: unknown) {
    const definition = this.#definitions.find(definition => definition.test(source))
    return definition?.name
  }
  normalize(toName: string, source: any) {
    const name = this.getTypeName(source)
    if (!name) {
      throw new Error(`No definition found for ${toName}`)
    }
   
    return this.map(name, toName, source)
  }
  map(fromName: string, toName: string, source: unknown) {
    // console.log('evaluating', fromName, toName, source)
    const path = this.#pathfindToMapper(fromName, toName)
    // console.log('path', path)
    if (!path) {
      throw new Error(`No mapping found from ${fromName} to ${toName}`)
    }
    const mapper = this.composeMappersFromPath(path)
    if (!mapper) {
      throw new Error(`No mapping found from ${fromName} to ${toName}`)
    }
    return mapper(source)
  }
  #pathfindToMapper(from: string, to: string) {
    const visited = new Set<string>()
    let path: string[] = [from]
    const queue = [path]
    while (queue.length) {
      path = queue.shift() as string[]
      const last = path[path.length - 1]
      if (last === to) {
        return path
      }
      if (visited.has(last)) {
        continue
      }
      visited.add(last)
      for (const next of Object.keys(this.#structure[last])) {
        queue.push(path.concat(next))
      }
    }
    return null
  }
  composeMappersFromPath(path: string[]) {
    const mappersChain: Graph[string][string][] = []
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i]
      const to = path[i + 1]
      if (!this.#structure[from][to]) {
        throw new Error(`No mapping found from ${from} to ${to}`)
      }
      mappersChain.push(this.#structure[from][to])
    }
    return (source: any) => mappersChain.reduce((acc, mapper) => mapper(acc), source)
  }
  createUnivalentFunction(
    functionToWrap: Function,
    normalizeArguments: (string | null | Symbol)[]) {
    return (...args : any[]) => {
      let genericArgument: string | null = null
      const normalizedArguments = args.map((argValue, index) => {
        const elementFromMapNormalizer = normalizeArguments[index]
        if (!elementFromMapNormalizer) return argValue
        if (typeof elementFromMapNormalizer === 'symbol') {
          const argumentTypeName = this.getTypeName(argValue)
          if (!argumentTypeName) {
            throw new Error('Generic argument must have a name')
          }
          genericArgument = argumentTypeName
          const argumentTargetType = elementFromMapNormalizer.description
          if (!argumentTargetType) {
            throw new Error('Generic argument must have a name')
          }
          return this.normalize(argumentTargetType, argValue)
        }
        if (typeof elementFromMapNormalizer === 'string') {
          return this.normalize(elementFromMapNormalizer, argValue)
        }
      })
      const result = functionToWrap(...normalizedArguments)
      // console.log('generic argument', genericArgument)
      if (!genericArgument) return result
      return this.normalize(genericArgument, result)
    }
  }
}

