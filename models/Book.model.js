const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: String, // from Google Books
    title: String,
    thumbnail: String
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
