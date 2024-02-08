const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    volumeId: String, 
    title: String,
    thumbnail: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
