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
  const { loading, createTokenPromise } = useOmise({
    publicKey: 'YOUR-OMISE-PUBLIC-KEY',
  });

  if (loading) return <div>Loading OmiseJS...</div>;

  const handleSubmit = async (cardFormValues) => {
    try {
      const token = await createTokenPromise('card', cardFormValues);
      // Send the token to your server to create a charge
    } catch (error) {
      // Handle error on the UI
    }
  };

  return <CreditCardForm handleSubmit={handleSubmit} />;
}
```

The `cardFormValues` object will hold the details of the card to be charged, e.g.

```js
{
  name: "Example card holder",
  number: "4242424242424242",
  security_code: "111",
  expiration_month: "06",
  expiration_year: "2020"
}
```

## What the use-omise hook returns

```jsx
const {
  loading,
  createTokenPromise,
  createToken,
  createSource,
  checkCreateTokenError,
} = useOmise({ publicKey: 'YOUR-OMISE-PUBLIC-KEY' });
```

**Note:** It is recommended that you use the `createTokenPromise` function for creating tokens - this allows you to use `async/await` and promise chaining syntax rather than callbacks. It also uses the `checkCreateTokenError` helper function internally to check for all possible errors.

| Value                   | Type     | Description                                                         |
| ----------------------- | -------- | ------------------------------------------------------------------- |
| `loading`               | boolean  | Indicates if the omise.js script is currently loading               |
| `createTokenPromise`    | function | A 'promisified' version of the createToken function                 |
| `createToken`           | function | The original Omise createToken function in callback format          |
| `createSource`          | function | The original Omise createSource function in callback format         |
| `checkCreateTokenError` | function | A helper function to check if the createToken has returned an error |

## How it works

1. Loads the [Omise.js](https://github.com/omise/omise.js) script. By default it will use the primary CDN (Singapore) but the secondary CDN (Japan) can also be used
2. Once loaded, it will initialise `Omise` by setting the public key that you provide
3. Returns you the functions needed to create tokens/source which can then be used to make charges on the server
