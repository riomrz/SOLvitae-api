const express = require('express');
const app = express();

// To make requests work 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

// Include route files
const appRoutes = require('./routes/routes');

// Use routes
app.use('/', appRoutes);

// Specify the port and start the server
const port = process.env.PORT || 8080; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});