const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

app.use('/user', expressProxy('http://localhost:5001'));
app.use('/captain', expressProxy('http://localhost:5002'));
app.use('/ride', expressProxy('http://localhost:5003'));

app.listen(5000, () => {
    console.log('API Gateway running on port 5000');
})