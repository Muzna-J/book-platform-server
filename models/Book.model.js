const { Schema, model } = require('mongoose');

const bookSchema = new Schema ( {
    openLibraryId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true

    },

    author: {
        type: String,
        required: true
    },

    coverImageUrl: {
        type: String,
        required: true
    }
}
)