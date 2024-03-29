const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model')
const router = new Router();
const { passwordValidator } = require('../utils');
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
const Book = require('../models/Book.model');


const allRoutes = require('./auth.routes');


router.get('/signup', isLoggedOut, (req, res)=> res.send('please provide email and password'));

router.post('/signup', isLoggedOut, (req, res, next) => {
    
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
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
            name,
            email, 
            passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
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

    router.get('/login', isLoggedOut, (req, res) => res.send('Please provide your login credentials'));

    router.post('/login', isLoggedOut, (req, res, next) => {
        const { email, password } = req.body;

        if(email === '' || password === '') {
            res.status(400).send({errorMessage: 'Please enter both email and password to login'});
            return
        }

        User.findOne({email})
        .then(user => {
            if(!user || !bcryptjs.compareSync(password, user.passwordHash)) {
                res.status(401).send({errorMessage: 'Invalid email or password'});
                return;
            } else {
                req.session.currentUser = user;
                res.status(200).json({ message: 'Login successful' }); 
            } 
        }) 
        .catch(error => next(error))

    });

    router.get('/profile', isLoggedIn, (req, res) => {
        res.send({ userInSession: req.session.currentUser })
    });

    router.post('/logout', isLoggedIn, (req, res, next) => {
        req.session.destroy(err => {
            if(err) next (err);
            res.send('User is loggged out')
        });
    });


    router.get('/current-user', isLoggedIn, (req, res) => {
        const user = {
            id: req.session.currentUser._id,
            name: req.session.currentUser.name,
            email: req.session.currentUser.email,
        };
        res.status(200).json({ currentUser: user });
    });

    router.put('/update-profile', isLoggedIn, async (req, res, next) => {
        const userId = req.session.currentUser._id;
        const { name, password } = req.body;
    
        try {
            // Construct the update object
            const updateData = {};
            if (name) updateData.name = name;
    
            if (password) {
                // Validate the new password
                if (!passwordValidator(password)) {
                    return res.status(400).send({
                        error: 'Password must have a minimum of 8 characters, including at least one number, one lowercase letter, one uppercase letter, and one special character'
                    });
                }
                // Hash the new password
                const hashedPassword = await bcryptjs.hash(password, saltRounds);
                updateData.passwordHash = hashedPassword;
            }
    
            // Update the user in the database
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            req.session.currentUser = updatedUser; //updating the user data in the session
            res.status(200).json({ message: 'Profile updated successfully', currentUser: updatedUser });
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).send({ errorMessage: error.message });
            } else {
                next(error);
            }
        }
    });
    
      
module.exports = router;