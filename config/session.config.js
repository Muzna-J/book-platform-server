const session = require('express-session');
const MongoStore = require('connect-mongo');


module.exports = app => {

    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: true,
            saveUninitialized: false,
            cookie: {
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: false,
                httpOnly: true,
                maxAge: 3600000
            },
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI 
            })
        })
    )
}