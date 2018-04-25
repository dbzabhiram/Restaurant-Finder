var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Get Homepage
router.get('/register', function(req, res){
	res.render('register');
});

//Login
router.get('/login', function(req, res){
	res.render('login');
});

//Register User
router.post('/register', function(req, res){
	var name = req.body.name ;
	var contact = req.body.contact ;
	var ownerName = req.body.ownerName ;
	var address = req.body.address ;
	var password = req.body.password ;
	var password2 = req.body.password2 ;

	//Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('contact', 'Contact Number is required').notEmpty();
	//req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('ownerName', 'Owner Name is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password2 do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors			
		});
	} else{
		var newUser = new User({
			name: name,
			contact: contact, 
			ownerName: ownerName,
			address: address,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(ownerName, password, done) {
    User.getUserByOwnerName(ownerName, function(err, user){
    	if(err) throw err;
    	if(!user){
    		return done(null, false, {message: 'Unknown User'});
    	}

    	User.comparePassword(password, user.password, function(err, isMatch){
    		if(err) throw err;
    		if(isMatch){
    			return done(null, user);
    		} else{
    			return done(null, false, {message: 'Invalid password'});		
    		}
    	});
    });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
  	res.redirect('/');
  }
);

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
