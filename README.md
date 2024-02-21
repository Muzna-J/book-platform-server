# Bookfinder

Book Platform is a web application built with the MERN stack (MongoDB, Express.js, React, and Node.js) that integrates the Google Books API to allow users to search for books, view details, manage a reading list, and leave reviews. It provides an interactive platform for book enthusiasts to explore and engage with a vast collection of books. Tailwind CSS is used for styling to offer a responsive and intuitive user interface. User authentication is handled through sessions, ensuring a secure and personalized experience.

## Features

- **Book Search**: Utilize the Google Books API to search for books by title, author, or ISBN.
- **Book Details**: View detailed information about the books, including descriptions, authors, and publication dates.
- **Reading List**: Add books to a personal reading list for future reference or reading.
- **Book Reviews**: Leave reviews for books, including star ratings and comments.
- **Reading List Management**: Search within your reading list and remove books you've finished or are no longer interested in.
- **User Profile**: Users can edit their username and update their password.

### Prerequisites

- Node.js (18.15)
- npm or yarn
- MongoDB
- React

### Installation

1. Clone the repository:

Backend:

`git clone https://github.com/Muzna-J/book-platform-server.git`

Frontend:

`git clone https://github.com/Muzna-J/book-platform-client.git`

### Docker

To deploy the Book Platform services using Docker, build and run the Docker containers for both the backend and frontend with the following commands:

Backend:

# Build the backend Docker image

docker build -t book-platform-server .

# Run the backend container

docker run -dp 5005:5005 book-platform-server

Frontend:

# Build the frontend Docker image

docker build -t book-platform-client .

# Run the frontend container

docker run -dp 80:80 book-platform-client

# Bookfinder

Book Platform is a web application built with the MERN stack (MongoDB, Express.js, React, and Node.js) that integrates the Google Books API to allow users to search for books, view details, manage a reading list, and leave reviews. It provides an interactive platform for book enthusiasts to explore and engage with a vast collection of books. Tailwind CSS is used for styling to offer a responsive and intuitive user interface. User authentication is handled through sessions, ensuring a secure and personalized experience.

## Features

- **Book Search**: Utilize the Google Books API to search for books by title, author, or ISBN.
- **Book Details**: View detailed information about the books, including descriptions, authors, and publication dates.
- **Reading List**: Add books to a personal reading list for future reference or reading.
- **Book Reviews**: Leave reviews for books, including star ratings and comments.
- **Reading List Management**: Search within your reading list and remove books you've finished or are no longer interested in.
- **User Profile**: Users can edit their username and update their password.

### Prerequisites

- Node.js (18.15)
- npm or yarn
- MongoDB
- React

### Installation

1. Clone the repository:

Backend:

`git clone https://github.com/Muzna-J/book-platform-server.git`

Frontend:

`git clone https://github.com/Muzna-J/book-platform-client.git`

# Deployment using Docker:

1. Deploying the server:

Environment variables:

PORT=5005
PROTOCOL=http
HOSTNAME=localhost
ORIGIN=http://localhost:8080
MONGODB_URI=mongodb+srv://{username}:pass@.....
SESS_SECRET=your_session_secret_here
GOOGLE_API_KEY=your_google_api_key_here
TOKEN_SECRET=your_token_secret_here
NODE_ENV=development

When running your Docker container, use the --env-file option to specify the environment file (in this case server.env):
`docker run -d -p 5005:5005 --env-file server.env muznaj/book-platform-server`

2. Deploying the client:

For deploying a React client application, environment variables such as
REACT_APP_PROTOCOL=http
REACT_APP_HOSTNAME=localhost
REACT_APP_PORT=5005

are set at build time and are already included in the Dockerfile.

To run the docker container, use the following command:

`docker run -d -p 80:80 muznaj/book-platform-client`
