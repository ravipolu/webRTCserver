const express = require('express')
const bodyParser = require('body-parser');
const app = express();

app.use(express.json({extended:true}))
app.use(bodyParser.json({extended: true}))




module.exports = app;