var mongoose = require('mongoose');

//Material Schema
var MaterialSchema = mongoose.Schema({
	dish: {
		type: String,
		required: true,
		index: true
	},
	itemCategory: {
		type: String
	},
	price: {
		type: Number,
		required: true
	},
	issuedUser: [{type : mongoose.Schema.ObjectId, ref : 'User'}]
});

var Material = module.exports = mongoose.model('Material', MaterialSchema);

module.exports.getMaterialByDish = function(dish, callback){
	var query = {dish: dish};
	
	Material.findOne(query, function (err, cb) {
		callback(cb)
	});
	
}

module.exports.getMaterialByPattern = function(dish, callback){
	var query = {dish: { $regex: new RegExp('.*'+dish+'.*', "i") }};
	
	Material.find(query, function (err, cb) {
		callback(cb)
	});	
}

module.exports.getAllMaterials = function (materials,callback) {
	Material.find({}, function(err, materials){
		callback(materials)
	})
}

module.exports.createMaterial = function(newMaterial, callback){
	newMaterial.save(callback);
}

module.exports.getMaterialById = function(id, callback){

	Material.findById(id, function(err, cb){
		callback(cb)
	});
}

module.exports.getMaterialsByIds = function (ids, callback) {
	let query = { _id: { $in : ids}}

	Material.find(query, function(err, cb){
		callback(cb)
	})
}





