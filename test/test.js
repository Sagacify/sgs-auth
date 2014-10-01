var SGSAuth = require('../src/sgs-auth');

var Delegates = require('./fixtures/delegates');
var World = {
	user: require('./fixtures/user')
};

var bodyParser = require('body-parser');
var supertest = require('supertest');
var passport = require('passport');
var express = require('express');

var request = supertest('http://localhost:8000');

describe('Testing the auth. module', function () {
	'use strict';


	before('Initialising the module', function () {
		global.sgsAuth = new SGSAuth(Delegates, {
			bearer: {},
			local: {}
		});
	});

	before('Initialising test server', function (callback) {
		var app = express();

		app.use(bodyParser.urlencoded({
			extended: true
		}));
		app.use(bodyParser.json());
		app.use(passport.initialize());

		app.post(
			'/auth/local/register',
			global.sgsAuth.with('local', 'register'),
			function (req, res) {
				res.status(200).json({
					token: req.user.data.token
				});
			}
		);

		app.post(
			'/auth/local/verify_email',
			global.sgsAuth.with('local', 'verifyEmail'),
			function (req, res) {
				res.status(200).json({
					token: req.user.data.token
				});
			}
		);

		app.get(
			'/auth/bearer/authorize',
			global.sgsAuth.with('bearer', 'authorize'),
			function (req, res) {
				res.status(200).end();
			}
		);

		app.post(
			'/auth/local/login',
			global.sgsAuth.with('local', 'login'),
			function (req, res) {
				res.status(200).end();
			}
		);

		app.listen(8000)
		.on('error', callback)
		.on('listening', callback);
	});

	it('Register', function (callback) {
		request
		.post('/auth/local/register')
		.send({
			username: World.user.username,
			password: World.user.password
		})
		.expect(200)
		.end(function (e, res) {
			if(e) {
				return callback(e);
			}

			World.registerToken = res.body.token;
			callback(null);
		});
	});

	it('Verify Email', function (callback) {
		request
		.post('/auth/local/verify_email')
		.send({
			username: World.user.username,
			password: World.user.password,
			token: World.registerToken
		})
		.expect(200)
		.end(function (e, res) {
			if(e) {
				return callback(e);
			}

			World.apiToken = res.body.token;
			callback(null);
		});
	});


	it('Verify Email', function (callback) {
		request
		.get('/auth/bearer/authorize')
		.set('Authorization', World.apiToken)
		.expect(200, callback);
	});

	// it('Login', function (callback) {
	// 	request
	// 	.post('/auth/local/login')
	// 	.send({
	// 		username: World.user.username,
	// 		password: World.user.password
	// 	})
	// 	.expect(200, callback);
	// });

});
