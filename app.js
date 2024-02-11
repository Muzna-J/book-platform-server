require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
require("./config")(app);
require('./config/session.config')(app); //the app getting passed here is the express app defined above
const { getBooks, getBookDetails } = require('../book-platform-server/api/googleBooksAPI')



// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRouter= require('./routes/auth.routes');
app.use('/', authRouter)

app.get('/signup', (req, res)=> res.send('this is the signup page'));

app.get('/login', (req, res)=> res.send('this is the login page'));

app.get('/profile', (req, res)=> res.send('this is the profile page'));

app.get('/books' , async (req, res) => {
    const query = req.query.q;
    if(!query) {
        return res.status(400).json({error: 'a query parameter is required'});
    }
    try {
        const books = await getBooks(query);
        if(!books || books.length === 0) {
            return res.status(400).json({error: 'no books found for this query'});
        }
        res.json(books); 
    } catch {
        console.error('Error feching books');
        res.status(500).json({error: 'internal server error'})
    }
});


app.get('/book/:volumeId', async(req, res) => {
    const volumeId = req.params.volumeId;

    if(!volumeId) {
        return res.status(400).json({error: 'Volume ID is required'})
    }
    try {
        const bookDetails = await getBookDetails(volumeId);
        if(!bookDetails) {
            return res.status(404).json({error: 'Book details not found'})
        }
        res.json(bookDetails)
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
});




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
