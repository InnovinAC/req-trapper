# req-trapper

`req-trapper` is an Express middleware for request validation inspired by Laravel's request validation. It allows you to define validation rules for your API requests and ensures that incoming data in the request payload meets your specified criteria.

## Features

- **Simple and Expressive:** Define validation rules for your request data with a clean and expressive syntax.
- **Middleware Integration:** Easily integrate `req-trapper` into your Express application as middleware for route-specific request validation.
- **Extensible:** Customize validation rules to suit your application's specific needs.
- **Custom Error Messages:** Override default validation error messages with custom ones tailored to your needs.

## Documentation

1. [Installation](#installation)
2. [Usage](#usage)
   1. [Basic Example](#basic-example) 
3. [Validation Rules](#validation-rules)
   1. [Built-In Rules](#built-in-rules)
   2. [Custom Validations](#custom-validations)
   3. [Custom Error Messages](#custom-error-messages)
4. [Contributing](#contributing)
5. [License](#license)

## Installation

Install `req-trapper` using npm:

```bash
npm install req-trapper
```

## Usage

### Basic Example

```javascript
import ReqTrapper from 'req-trapper';
import express from 'express';

const app = express();
const reqTrapper = new ReqTrapper();

// Use req-trapper as middleware
app.post('/example',
    reqTrapper.validate([{ name: 'phone', validation: 'required|number' }]), // Validation rules
    (req, res) => {
  // Your route logic here
});

// Use req-trapper in another route
app.post('/example2',
    reqTrapper.validate([{ name: 'email', validation: 'required|email' }]), // Validation rules
    (req, res) => {
        // Your route logic here
    });
```

## Validation Rules

### Built-In Rules

Here are the built-in validation rules you can use:

**required**: Ensures that the specified field exists in the request data.
   - Example: `required`

**email**: Ensures that the specified field contains a valid email address.
   - Example: `email`

**min:x**: Ensures that the specified field has at least `x` characters or is greater than or equal to `x`.
   - Example: `min:5`

**max:x**: Ensures that the specified field has no more than `x` characters or is less than or equal to `x`.
   - Example: `max:10`

**in:values**: Ensures that the specified field is one of the given values (comma-separated).
   - Example: `in:admin,user,guest`

**number**: Ensures that the specified field is a number.
   - Example: `number`

**greater_than:x**: Ensures that the specified field is greater than `x`.
   - Example: `greater_than:18`

**nullable**: Allows a field to be null.
   - Example: `nullable`

**url**: Ensures that the specified field is a valid URL.
   - Example: `url`

**boolean**: Ensures that the specified field is a boolean.
   - Example: `boolean`

**alpha**: Ensures that the specified field contains only alphabetic characters.
   - Example: `alpha`

**alpha_num**: Ensures that the specified field contains only alphabetic and numeric characters.
   - Example: `alpha_num`

**array**: Ensures that the specified field is an array.
   - Example: `array`

**json**: Ensures that the specified field is valid JSON.
   - Example: `json`

**date**: Ensures that the specified field is a valid date.
   - Example: `date`

**after:date**: Ensures that the specified date field is after the given date.
   - Example: `after:2024-01-01`

**before:date**: Ensures that the specified date field is before the given date.
   - Example: `before:2024-01-01`

**unique**: Ensures that the specified field is unique in the database (database integration required).
   - Example: `unique:users,email`

**digits:x**: Ensures that the specified field contains exactly `x` digits.
   - Example: `digits:10`

**digits_between:min,max**: Ensures that the specified field contains digits between the minimum and maximum values.
   - Example: `digits_between:5,10`

**exists**: Ensures that the specified field exists in the database (database integration required).
   - Example: `exists:users,email`

**image**: Ensures that the specified field is an image file (based on MIME type).
   - Example: `image`

**file**: Ensures that the specified field is a file.
   - Example: `file`

**mimes:types**: Ensures that the file is of the specified MIME type(s).
   - Example: `mimes:jpeg,png`

**required_if:other_field**: Requires the field if the other field is present.
   - Example: `required_if:role,admin`

**required_unless:other_field**: Requires the field unless the other field is present.
   - Example: `required_unless:role,guest`

**required_with:other_field**: Requires the field if the other field is present.
   - Example: `required_with:password`

**required_with_all:fields**: Requires the field if all the other fields are present.
   - Example: `required_with_all:password,confirm_password`

**required_without:other_field**: Requires the field if the other field is not present.
   - Example: `required_without:email`

**required_without_all:fields**: Requires the field if none of the other fields are present.
   - Example: `required_without_all:email,phone`

### Custom Validations

You can define your own custom validation rules. For example:

```javascript
const customValidations = [
    {
        validation: 'isEven',
        action: (value) => value % 2 === 0
    }
];

const reqTrapper = new ReqTrapper({ customValidations });
```

You can then use your custom validation in the rules:

```javascript
app.post('/example',
    reqTrapper.validate([{ name: 'number', validation: 'required|isEven' }]),
    (req, res) => {
        // Your route logic here
    }
);
```

### Custom Error Messages

You can override the default error messages by providing custom messages:

```javascript
const reqTrapper = new ReqTrapper();

reqTrapper.setCustomMessages({
    'email.required': 'Email is mandatory!',
    'phone.number': 'Phone number must be a valid number.'
});
```

These custom messages will be used in place of the default ones.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on Github.