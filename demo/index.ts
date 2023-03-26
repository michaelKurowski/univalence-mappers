import { createGraph } from "./definitions";
import { CustomerArr } from "./types";

const graph = createGraph()

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