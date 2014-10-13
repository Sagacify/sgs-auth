var PassportGoogle = require('passport-google-oauth').OAuth2Strategy;

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	function GoogleLogin (config) {

		this.config = _.extend({}, config);

	}

	GoogleLogin.prototype.passportStrategy = PassportGoogle;

	GoogleLogin.prototype.name = 'google-login';

	GoogleLogin.prototype.stateIn = [
		'registered'
	];

	GoogleLogin.prototype.stateOut = 'registered';

	GoogleLogin.prototype.steps = [
		'findOrCreateUserByOAuthId',

		'addGoogleAccount',

		'createToken',
		'hashToken',
		'addBearerAccount',
		'removeInvalidTokens',

		'updateState',

		'saveUser'
	];

	GoogleLogin.prototype.mapper = function (accessToken, refreshToken, rawResponse, callback) {
		var mixin = {
			user: null,
			specs: {
				stateIn: this.stateIn,
				stateOut: this.stateOut
			},
			data: {
				oauthId: rawResponse.id,
				profile: rawResponse,
				accessToken: accessToken,
			},
			accounts: []
		};

		return callback(null, mixin);
	};

	return GoogleLogin;

})();
