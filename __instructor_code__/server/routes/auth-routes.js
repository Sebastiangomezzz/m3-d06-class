//1 import packages and User model
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = process.env.SALT || 10;

const User = require('./../models/User.model');
const isNotLoggedIn = require('./../middleware/isNotLoggedIn')

router.post('/signup', (req, res)=>{
	const {username, email, password} = req.body

	if(!username || !password || !email) res.status(400).json({message: 'You provided incorrect signup values'})

	User.findOne({username})
	.then(user=> {
		if(user) {
			res.status(400).json({message: 'The username already exists'})
		} else {
			//Hash the password
			const salt = bcrypt.genSaltSync(saltRounds);
		    const hash = bcrypt.hashSync(password, salt);

			User.create({username, email, password: hash})
			.then( newUser => res.json(newUser))
			.catch(err=>res.json(err))
		}
	})
})

router.post('/login', (req, res)=>{
	const {username, password} = req.body

	User.findOne({username})
	.then(user=>{
		if(!user){
			res.status(400).json({message: 'The credentials are invalid'})
		}else{
			const encryptedPassword = user.password;
			const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

			if(passwordCorrect){
				req.session.currentUser = user
				res.json({message: 'User correctly logged in'}) // Express will close the response automatically with a 200 status code
			} else {
				res.status(400).res.json({message: 'The credentials are invalid'})
			}
		}
	})
	.catch(err=>res.json(err)) //Express will automatically set a 400 erorr status code in .cathc
})

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(400).json({ message: 'Something went wrong! Yikes!' });
		} else {
			res.json({message: 'User successfully logged out'});
		}
	});
}

module.exports = router;
