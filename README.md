# What is this
This is a proof of concept of an idea that I've had, using the univalence principle from homotopy type theory as an inspiration.

The general idea is that we define mappers between types to create generic functions that can handle any type that's equivalent to another type.

I.e. if we have three types that represents a customer
`[firstName, surname, email] // CustomerArr`
`{name: firstName, surname: surname, email: email} // CustomerRecord`
`{firstName: firstName, lastName: surname, emailAddress: email} // PrettyCustomerRecord`

We define a function that handles only one of these, but thanks to the framework represented in this proof of concept it can handle each of these types equally as well.
i.e.:
```
const swapSurnameWithName = (customerArr: CustomerArr) => {
  const [ firstName, lastName, emailAddress ] = customerArr
  return [
    lastName,
    firstName,
    emailAddress
  ]
}

const swapSurnameWithNameU = graph.createUnivalentFunction(swapSurnameWithName,
[
  // Which type does the body of the function understand
  Symbol('CustomerArr')
])
```


This function will handle all the types despite the fact that it only operates on CustomerArr:

```
// Because we defined how types relate to each other
// our function can handle any of these types
console.time('Example 1')
const result1 = swapSurnameWithNameU({
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'johndoe@gmail.com'
})
console.timeEnd('Example 1')

console.time('Example 2')
const result2 = swapSurnameWithNameU({
  name: 'John',
  surname: 'Doe',
  email: 'johndoe@gmail.com'
})
console.timeEnd('Example 2')
```

Please see `demo` for example.

# How to run demo
The good, old `npm i` and `npm start`