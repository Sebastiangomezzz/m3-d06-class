//1 import packages and User model
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = process.env.SALT || 10;

const User = require('./../models/User.model');

const isNotLoggedIn = require('./../middleware/isNotLoggedIn')

//2 - Create 5 routes: 2 for login, 2 for signup and 1 for logout
router.get('/signup', isNotLoggedIn, (req, res) => {
	res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, (req, res) => {
	
	//GET VALUES FROM FORM (body of the form)
	const { username, email, password } = req.body;//destructure the body

	//VALIDATE INPUT
	if (
		!username ||
		username === '' ||
		!password ||
		password === '' ||
		!email ||
		email === '' ||
		!email.includes('@')
	) {
		res.status(400).json({ errorMessage: 'Something went wrong' });
	}

	//Check if user already exists
	User.findOne({ username: username })
		.then((user) => {
			
			//If user exists, send error
			if (user) {
				res.status(400).json({ errorMessage: 'The user name already exists' });
				return;
			
			} else {
			
				//Hash the password
				const salt = bcrypt.genSaltSync(saltRounds);
				const hash = bcrypt.hashSync(password, salt);

				//If user does not exist, create it
				User.create({ username, email, password: hash })
					.then(newUser => res.json(newUser))
					.catch(err => res.json(err));
			}
		})
		.catch(err => res.json(err));
});


router.post('/login', (req, res) => {
	//GET VALUES FROM FORM
	const { username, password } = req.body;

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.status(400).json({ errorMessage: 'Credentials are invalid' });
			} else {
				
				const encryptedPassword = user.password;
				const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

				if (passwordCorrect) {
					req.session.currentUser = user;//create a session, now react can see the user object
					res.json({message: "user correctly logged in"});//express will give an automatic code of 200, no message needed
				} else {
					res.status(400).json({message: "loggin credentials are invalid"});
				}
			}
		})
		.catch((err) => console.log(err));
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(400).json({ message: 'Something went wrong! Yikes!' });
		} else {
			res.json({ message: 'User successfully logged out' });
		}
	});
});

module.exports = router;
