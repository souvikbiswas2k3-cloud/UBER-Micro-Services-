const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

app.use('/user', expressProxy('http://localhost:5001'));

app.listen(5000, () => {
    console.log('API Gateway running on port 5000');
})