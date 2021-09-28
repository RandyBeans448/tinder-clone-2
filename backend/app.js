require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const http = require('http')

const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const app = express();

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use('*',cors(corsOptions));

app.use(bodyParser.json({limit: '1000kb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const mongoose = require('mongoose');
const connection =  "mongodb+srv://BishopTech:HairyToeLetItFlow42069@cluster0.hvrz8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    
});

const userRoutes = require('./routes/userRoutes');

app.use('/', userRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  next();
});

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API for Tinder!',
  });
 
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

app.listen(5000, () => console.log('Listening on port 5000!'))

// module.exports.variableName = "db";