const axios = require('axios');
const googleApiKey = process.env.GOOGLE_API_KEY;
const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
//const bookDetailUrl = `https://www.googleapis.com/books/v1/volumes/${volumeId}`;

async function getBooks(query) {
    const books = [];
    try {
        const response = await axios.get(baseUrl, {
            params: {
                q: query,
                key: googleApiKey,
            }
        })

        if(response.data.items) {
             
            response.data.items.forEach(book => {
                const title = book.volumeInfo.title;
                const author = book.volumeInfo.authors
                const coverImage = book.volumeInfo.imageLinks?.thumbnail;
                const volumeId = book.id;
                books.push({title, author, coverImage, volumeId});
            })
        } 
        return books;
       
    } catch (error) {
        console.error('Error fetching books:', error);
    }

}


async function getBookDetails(volumeId) {
    const bookDetailUrl = `https://www.googleapis.com/books/v1/volumes/${volumeId}`;
    try {
        const response = await axios.get(bookDetailUrl, {
            params: {
                key: googleApiKey
            }
        });
        return response.data
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

module.exports = {getBooks, getBookDetails};