const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    volumeId: String, // from Google Books
    title: String,
    thumbnail: String
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
