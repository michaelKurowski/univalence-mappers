import { TypeGraph } from "../src";

const graph = new TypeGraph()


////////// DEFINITIONS ////////////

type CustomerArr = [
  string,
  string,
  string,
]

type CustomerRecord = {
  name: string
  surname: string
  email: string
}

type PrettyCustomerRecord = {
  firstName: string
  lastName: string
  emailAddress: string
}

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

////////// Let's get to the point ////////////

// We define the function to switch the surname with the first name
// only for one type
const swapSurnameWithName = graph.createUnivalentFunction((customerArr: CustomerArr) => {
  return [
    customerArr[1],
    customerArr[0],
    customerArr[2]
  ]
},
[
  // Which type does the body of the function understand
  Symbol('CustomerArr')
])

// Because we defined how types relate to each other
// our function can handle any of these types
console.time('Example 1')
const result1 = swapSurnameWithName({
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'johndoe@gmail.com'
})
console.timeEnd('Example 1')

console.time('Example 2')
const result2 = swapSurnameWithName({
  name: 'John',
  surname: 'Doe',
  email: 'johndoe@gmail.com'
})
console.timeEnd('Example 2')


// { firstName: 'Doe', lastName: 'John', emailAddress: 'johndoe@gmail.com' }
console.log('RESULT 1')
console.log(result1) 


// { name: 'Doe', surname: 'John', email: 'johndoe@gmail.com' }
console.log('RESULT 2')
console.log(result2) 