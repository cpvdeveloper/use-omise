# use-omise

A React hook for collecting card details ready for [Omise](https://www.omise.co/) payments.

## Installation

Install with npm

```
npm install use-omise
```

or with yarn

```
yarn add use-omise
```

And make sure you also have **React installed at version 16.8 or above**.

## How to use

```jsx
function PaymentForm() {
  const { loading, createToken } = useOmise({
    publicKey: 'YOUR-OMISE-PUBLIC-KEY',
  });

  if (loading) return <div>Loading OmiseJS...</div>;

  const handleSubmit = (cardFormValues) => {
    createToken('card', cardFormValues, (status, response) => {
      if (status === 200) {
        // The token is available as response.id.
        // Send the token to your server to create a charge e.g. { token: response.id }
      }
    });
  };

  return <CreditCardForm handleSubmit={handleSubmit} />;
}
```

The `cardFormValues` object will hold the details of the card to be charged, e.g.

```js
{
  name: "Exmaple card holder",
  number: "4242424242424242",
  security_code: "111",
  expiration_month: "06",
  expiration_year: "2020"
}
```

## How it works

1. Loads the [Omise.js](https://github.com/omise/omise.js) script. By default it will use the primary CDN (Singapore) but the secondary CDN (Japan) can also be used
2. Once loaded, it will initialise `Omise` by setting the public key that you provide
3. Returns you the `createToken` function which can be used to use create tokens which can then be used to make charges
   - Also returned is the `createSource` function for creating sources
