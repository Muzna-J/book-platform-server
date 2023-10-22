require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRouter= require('./routes/auth.routes');
app.use('/', authRouter)

app.get('/signup', (req, res)=> res.send('this is the signup page'));

app.get('/login', (req, res)=> res.send('this is the login page'));

app.get('/profile', (req, res)=> res.send('this is the profile page'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
