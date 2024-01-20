# req-trapper

`req-trapper` is an Express middleware for request validation inspired by Laravel request validation. It allows you to define validation rules for your API requests and ensures that incoming data in the request payload meets your specified criteria.

## Features

- **Simple and Expressive:** Define validation rules for your request data with a clean and expressive syntax.

- **Middleware Integration:** Easily integrate `req-trapper` into your Express application as middleware for route-specific request validation.

- **Extensible:** Customize validation rules to suit your application's specific needs(This is in progress)

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

// Define validation rules
reqTrapper.setRules([
  { name: 'phone', validation: 'required|number' },
]);

// Use req-trapper as middleware
app.post('/example', reqTrapper.middleware, (req, res) => {
  // Your route logic here
});
```

## Rules
- `required`: Ensures that the specified field exists in the request data.
- `number`: Ensures that the specified field is a number.
Feel free to extend the rules according to your application's requirements.

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.
