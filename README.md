# Zaengle Error Handler

Handling frontend errors by expecting a specific response can be problematic. In many instances, the code in a `catch` block can cause an error itself. For example:

```js
try {
  // axios call here
} catch ({ response }) {
  showFlashNotification({
    title: response.data.message,
  });
}
```

This code could fail in a few ways:

- If there's no `response` (e.g., if a network error occurs)
- If there's no `response.data`
- If there's no `response.data.message`

This package is meant to consolidate the handling of axios errors in order to prevent such failures. Instead of destructuring an axios error response and trying to get an error message from it, you simply pass the axios error to the error handler, call a method that parses the error, and receive an error message in response. Error messages are customizable, but defaults are provided.

Useful methods for checking/retrieving specific errors (especially validation errors) are also included.

## Table of Contents

- [Installation](#installation)
  - [Yarn](#yarn)
  - [npm](#npm)
- [Usage](#usage)
  - [With Default Error Messages](#with-default-error-messages)
  - [With Custom Error Messages](#with-custom-error-messages)
- [Examples](#examples)
  - [Creating a Nuxt Plugin](#creating-a-nuxt-plugin)
- [API](#api)
  - [Options](#options)
  - [`setAll(errors): this`](#setallerrors-this)
  - [`setValidation(errors): void`](#setvalidationerrors-void)
  - [`parse(): { status: number, message: string }`](#parse--status-number-message-string-)
  - [`add(errors): void`](#adderrors-void)
  - [`any(): boolean`](#any-boolean)
  - [`has(field: string): boolean`](#hasfield-string-boolean)
  - [`get(field: string | null): string[] | object`](#getfield-string--null-string--object)
  - [`getFirst(field: string | null): string | string[] | null`](#getfirstfield-string--null-string--string--null)
  - [`clear(field: string | null): void`](#clearfield-string--null-void)

## Installation

### Yarn

```bash
$ yarn add @zaengle/error-handler
```

### npm

```bash
$ npm install @zaengle/error-handler
```

## Usage

### With Default Error Messages

```js
import ErrorHandler from '@zaengle/error-handler'

try {
  // axios call here
} catch (errors) {
  const errorResponse = new ErrorHandler().setAll(errors).parse()

  // Some method to display an error message
  showErrorMessage(`Error status: ${errorResponse.status}. Error message: ${errorResponse.message}`)
}
```

### With Custom Error Messages

```js
import ErrorHandler from '@zaengle/error-handler'

try {
  // axios call here
} catch (errors) {
  const errorResponse = new ErrorHandler(
    // Custom messages for specific statuses
    {
      401: `Whoops! You can't access that.`,
      404: `Uh oh! We couldn't find that.`,
      500: `Oh no! Server problem.`,
    },
    // Custom default message (if there's no corresponding status message)
    'Yikes! Something went wrong.',
  )
    .setAll(errors)
    .parse()

  // Some method to display an error message
  showErrorMessage(`Error status: ${errorResponse.status}. Error message: ${errorResponse.message}`)
}
```

## Examples

The examples are geared towards Vue/Nuxt applications, but the package is general enough that it can be used in other JavaScript applications that use axios.

### Creating a Nuxt Plugin

```js
// plugins/error-handler.js

import ErrorHandler from '@zaengle/error-handler'

export default (context, inject) => {
  inject('errorHandler', new ErrorHandler())
}
```

```js
// nuxt.config.js

plugins: [
  { src: '~/plugins/error-handler.js' },
],
```

```js
// pages/somePage.vue

async middleware({ error, $errorHandler }) {
  try {
    // axios or Vuex action call here
  } catch (errors) {
    const errorResponse = $errorHandler.setAll(errors).parse()

    error({
      statusCode: errorResponse.status,
      message: errorResponse.message,
    })
  }
}
```

```js
// components/someComponent.vue

export default {
  methods: {
    handleSomething() {
      try {
        // axios call here
      } catch (errors) {
        const errorResponse = this.$errorHandler.setAll(errors).parse()

        // Do something with errorResponse
      }
    },
  },
};
```

## API

### Options

When a new instance is created, it has 2 _optional_ arguments: a `customMessages` object and a `customDefaultMessage` string.

```js
new ErrorHandler(customMessages, customDefaultMessage)
```

`customMessages` is expected to have the following format:

```js
{
  // status code {number}: error message {string}
  401: 'You must be logged in to access this.',
}
```

Defaults are provided for both arguments and can be found [here](src/ErrorMessages.js).

**Note**: When passing custom messages, the defaults will be overwritten, so be sure to include any specific status codes, and their related messages, that you want to have available.

### `setAll(errors): this`

This method takes the errors that are passed to it and sets them as the class instance's errors. It returns `this` because it's meant to be chained with `parse`, but it can also be chained with other methods.

### `setValidation(errors): void`

This method takes an `errors` object that is typically the axios `response.data` so that it can destructure `errors` from `response.data` and set those validation errors as the class instance's errors. It is **not** recommended to call this method on its own because doing so would assume that both `response.data` and `response.data.errors` are defined, which may not always be the case (e.g., if a network error occurs).

### `parse(): { status: number, message: string }`

This method examines the class instance's errors and returns an object that includes the `status` and the `message`. If the `status` is equal to `422` (a validation error), `parse` will call the `setValidation` method.

### `add(errors): void`

This method will add additional errors to the existing class instance's `errors` object.

### `any(): boolean`

This method determines if there are any errors.

### `has(field: string): boolean`

This method determines if a validation error exists for the given field. For example:

```js
const errorHandler = new ErrorHandler().setAll(errors);

const hasEmailError = errorHandler.has('email');
```

### `get(field: string | null): string[] | object`

This method retrieves the validation errors for the given field, if one is provided. If a field is not provided, it returns all of the class instance's errors.

### `getFirst(field: string | null): string | string[] | null`

This method retrieves the first validation error for the given field, if the field's errors are stored in an array. Otherwise, it will return the error for the given field. If no field is provided, it will return `null`. This method can be useful when displaying form errors. For example:

```html
<div
  v-if="errors.has('email')"
  class="error-messages"
  v-text="errors.getFirst('email')"
/>
```

### `clear(field: string | null): void`

If a field is provided, this method will clear the errors for the given field. Otherwise, it will clear all of the class instance's errors. It can be useful for removing form errors once the user begins typing in the form field. For example:

```html
<input
  id="username"
  type="text"
  name="username"
  @input="errors.clear('username')"
>
```
