import { TypeGraph } from "../src"
import { CustomerArr, CustomerRecord, PrettyCustomerRecord } from "./types"


export function createGraph() {
  const graph = new TypeGraph()
  graph.addTypeDefinition({
    name: 'CustomerArr',
    test(value: unknown): value is CustomerArr {
      if (!Array.isArray(value) || value.length !== 3) return false
      return value.every((element: unknown) => typeof element === 'string')
    }
  })
  
  graph.addTypeDefinition({
    name: 'PrettyCustomerRecord',
    test(value: unknown): value is PrettyCustomerRecord {
      if (typeof value !== 'object' || !value) return false
      const assumedValue = value as PrettyCustomerRecord
      return typeof assumedValue.firstName === 'string' && typeof assumedValue.lastName === 'string' && typeof assumedValue.emailAddress === 'string'
    }
  })
  
  graph.addTypeDefinition({
    name: 'CustomerRecord',
    test(value: unknown): value is CustomerRecord {
      if (typeof value !== 'object' || !value) return false
      const assumedValue = value as CustomerRecord
      return typeof assumedValue.name === 'string' && typeof assumedValue.surname === 'string' && typeof assumedValue.email === 'string'
    }
  })
  
  graph.addMapping({
    fromName: 'CustomerArr',
    toName: 'CustomerRecord',
    to(from: CustomerArr) {
      const [name, surname, email] = from
      return { name, surname, email }
    },
    from(to: CustomerRecord) {
      const { name, surname, email } = to
      return [name, surname, email] as CustomerArr
    }
  })
  
  graph.addMapping({
    fromName: 'CustomerRecord',
    toName: 'PrettyCustomerRecord',
    to(from: CustomerRecord) {
      const { name, surname, email } = from
      return { firstName: name, lastName: surname, emailAddress: email }
    },
    from(to: PrettyCustomerRecord) {
      const { firstName, lastName, emailAddress } = to
      return { name: firstName, surname: lastName, email: emailAddress }
    }
  })
  return graph
}