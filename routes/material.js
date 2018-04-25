var express = require('express');
var router = express.Router();

var Material = require('../models/material');
var User = require('../models/user');

//Current Menu
// router.get('/index', ensureAuthenticated, function (req, res) {
	
// 	Material.getAllMaterials(function(materials){

// 		res.render('index', {
// 			materials : materials
// 		});
// 	})

// })


// // Available Materialss
// router.post('/index', ensureAuthenticated, function (req, res) {
// 	var name = req.body.name;

// 	Material.getMaterialByPattern(name, function(materials){

// 		res.render('index', {
// 			materials : materials
// 		});
// 	})

// })

// Edit Menu
router.get('/menu', ensureAuthenticated, function(req, res){
	res.render('menu');
});

// Adding a Dish to Menu
router.post('/menu', ensureAuthenticated, function(req, res){
	var dish = req.body.dish;
	var itemCategory = req.body.itemCategory;
	var price = req.body.price;

	// Validation
	req.checkBody('dish', 'Dish Name is required').notEmpty();
	req.checkBody('price', 'Price of the given dish is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('menu',{
			errors:errors
		});
	} else {
		let user = req.user;
		var newMaterial = new Material({
			dish: dish,
			itemCategory: itemCategory,
			price: price,
			issuedUser: [user]
		});

		//Material.getMaterialById(req.params.id, function(material){
			user.issuedMaterial.push(material)
			user.save()
		//});

		Material.getMaterialByDish(newMaterial.dish, function(existingMaterial){

			Material.createMaterial(newMaterial, function(err, material){
				if(err) throw err;
			});

		});

		req.flash('success_msg', 'You have added dish to the Menu.');

		res.redirect('/');
	}
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
