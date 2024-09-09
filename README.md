# req-trapper

`req-trapper` is an Express middleware for request validation inspired by Laravel request validation. It allows you to define validation rules for your API requests and ensures that incoming data in the request payload meets your specified criteria.

## Features

- **Simple and Expressive:** Define validation rules for your request data with a clean and expressive syntax.

- **Middleware Integration:** Easily integrate `req-trapper` into your Express application as middleware for route-specific request validation.

- **Extensible:** Customize validation rules to suit your application's specific needs(This is in progress)
# Documentation
1. [Installation](#installation)
2. [Usage](#usage)
   1. [Basic Example](#basic-example) 
3. [Rules](#rules)

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
    reqTrapper.validate([{ name: 'phone', validation: 'required|number' }]), // validation rules
    (req, res) => {
  // Your route logic here
});

// works across multiple requests
app.post('/example2',
    reqTrapper.validate([{ name: 'email', validation: 'required|email' }]), // validation rules
    (req, res) => {
        // Your route logic here
    });
```

## Rules
* <a href="#required">Required</a>
* <a href="#number">Number</a>
* <a href="#min">Min</a>
### required
Ensures that the specified field exists in the request data.

### number
Ensures that the specified field is a number.
### min:x
Ensures that the specified field has at least ```x``` characters. ```x``` should be a number

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the ISC License.
