# What is this
This is a proof of concept of an idea that's loosely inspired by the univalence principle from homotopy type theory as an inspiration.

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

swapSurnameWithNameU({
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'johndoe@gmail.com'
})
// outputs { firstName: 'Doe', lastName: 'John', emailAddress: 'johndoe@gmail.com' }


swapSurnameWithNameU({
  name: 'John',
  surname: 'Doe',
  email: 'johndoe@gmail.com'
})
// outputs { name: 'Doe', surname: 'John', email: 'johndoe@gmail.com' }
```

# How to run demo
The good, old `npm i` and `npm start`. It uses ts-node as a dependency to run this example.