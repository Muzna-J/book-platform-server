const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model')
const router = new Router();
const { passwordValidator } = require('../utils');
const mongoose = require('mongoose');

router.get('/signup', (req, res)=> res.send('please provide email and password'));

router.post('/signup', (req, res, next) => {
    
    //console.log(req.body)
    const { email, password } = req.body;

    if(!email || !password) {
        res.send({errorMessage: 'All fields are mandatory. Please provide your email and password'})
    }

    //validate the password before hashing using Regex
    if(!passwordValidator(password)) {
        return res.status(400).send({
            error: 'Password must have a minimum of 8 characters, including at least one number, one lowercase letter,one uppercase letter, and one special character'
        });
    }
    
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
            email, 
            passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.status(201).json({message: 'User registered successfully', user: userFromDB})
        res.redirect('/profile')
      })
      .catch(error => {
        if(error instanceof mongoose.Error.ValidationError) {
            res.status(500).send({errorMessage: error.message})
    } else if(error.code === 11000) {
        res.status(500).send({errorMessage: 'Email must be unique'})
        } else {
            next(error);
      }});

    });

    router.get('/login', (req, res) => res.send('Please provide your login credentials'));

    router.post('/login', (req, res, next) => {
        console.log('SESSION =====> ', req.session)
        const { email, password } = req.body;

        if(email === '' || password === '') {
            res.send({errorMessage: 'Please enter both email and password to login'});
            return
        }

        User.findOne({email})
        .then(user => {
            if(!user) {
                res.send({errorMessage: 'Email is not registered. Try with another email.'});
                return;
            } else if(bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/profile') // to-do - json message send('login successful')
            } else {
                res.send({errorMessage: 'Incorrect password'})
            }
        }) 
        .catch(error => next(error))

    });

    router.get('/profile', (req, res) => {
        res.send({ userInSession: req.session.currentUser })
    });

    router.post('/logout', (req, res, next) => {
        req.session.destroy(err => {
            if(err) next (err);
            // res.redirect('/')
            res.send('User is loggged out')
        });
    });
      
module.exports = router;