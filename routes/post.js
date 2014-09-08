var settings = require('../settings'),
	mongo = require('mongoose'),
	db = require('../models/db');

var entries = mongo.Schema({
    "title": String,
    "body": String,
    "entryId": Number
});

var Entries = mongo.model(settings.dbCollectionName,entries);

var posts = [];

exports.index = function(req,res) {
	Entries.find({},function(err,posts) {
		res.render('posts/index',{posts: posts});
	});
};

exports.show = function(req,res) {
	Entries.findOne({entryId: req.params.id},function(err,post) {
		res.render('posts/show',{post: post});
	});
};

exports.json = function(req,res) {
	Entries.findOne({entryId: req.params.id},function(err,post) {
		res.json({
			title: post.title,
			body: post.body,
			entryId: post.entryId
		});
	});
};

exports.new = function(req,res) {
	res.render('posts/new');
};

exports.edit = function(req,res) {
	Entries.findOne({entryId: req.params.id},function(err,post) {
		res.render('posts/edit',{post: post});
	});
};

exports.update = function(req,res,next) {
	if(req.body.id !== req.params.id) {
		next(new Error('ID not valid'));
	} else {
		Entries.findOne({entryId: req.body.id},function(err,post) {
			post.title = req.body.title;
			post.body = req.body.body;
			post.entryId = req.body.id;

			post.save(function(err) {
			  if (err) { console.log(err); }
			});
		});
		res.redirect('/');
	}
};

exports.destroy = function(req,res,next) {
	if(req.body.id !== req.params.id) {
		next(new Error('ID not valid'));
	} else {
		Entries.remove({entryId: parseInt(req.body.id)}, function(err) {
			console.log(err);
		});
		res.redirect('/');
	}
};

exports.create = function(req,res) {
	Entries.find({}).sort('-entryId').limit(1).exec(function(err, post) {
		var entryId = post.length === 0 ? 0 : post[0].entryId + 1;
		var entry = new Entries({
			title: req.body.title,
			body: req.body.body,
			entryId: entryId
		});
		entry.save(function(err) {
		  if (err) { console.log(err); }
		});
	});
	res.redirect('/');
}