var mongo = require('mongoose'),
	db = require('../models/db');

var entries = mongo.Schema({
    "title": String,
    "body": String
})
var Entries = mongo.model('entries',entries);


var posts = [];
Entries.find({}, function(err, collections) {
	if(err) throw err;
	for (var i = 0; i < collections.length; i++) {
		posts.push(collections[i]);
	};
});

exports.index = function(req,res) {
	res.render('posts/index',{posts: posts});
}

exports.show = function(req,res) {
	res.render('posts/show',{post: posts[req.params.id]});
}

exports.json = function(req,res) {
	res.json({
		title: posts[req.params.id].title,
		body: posts[req.params.id].body
	});
}

exports.new = function(req,res) {
	res.render('posts/new');
}

exports.edit = function(req,res) {
	res.render('posts/edit',{post: posts[req.params.id],id: req.params.id});
}

exports.update = function(req,res,next) {
	if(req.body.id !== req.params.id) {
		next(new Error('ID not valid'));
	} else {
		posts[req.body.id] = {
			title: req.body.title,
			body: req.body.body
		};
		res.redirect('/');
	}
}

exports.destroy = function(req,res,next) {
	if(req.body.id !== req.params.id) {
		next(new Error('ID not valid'));
	} else {
		posts.splice(req.body.id,1);
		res.redirect('/');
	}
}

exports.create = function(req,res) {
	var post = {
		title: req.body.title,
		body: req.body.body
	};
	posts.push(post);
	res.redirect('/');
}