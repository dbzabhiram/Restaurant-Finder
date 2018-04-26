var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Material = require('./material')

//User Schema
var UserSchema = mongoose.Schema({
	ownerName: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	contact: {
		type: String
	},
	name: {
		type: String
	},
	address:{
		type: String
	},
	issuedMaterial: [ {type : mongoose.Schema.ObjectId, ref : 'Material'} ]
},
{
	usePushEach: true
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	})
}

module.exports.getUserByOwnerName = function(ownerName, callback){
	var query = {ownerName: ownerName};
	User.findOne(query, function(err, user) {
		console.log(user)
		callback(null, user);
	});
}

module.exports.getUserById = function(id, callback){
	User.findById(id, function(err, user){
		console.log(user)
		callback(null, user);
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
