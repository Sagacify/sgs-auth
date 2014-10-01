var _ = require('underscore');

module.exports = (function () {
	'use strict';

	function BearerAddAccount (config) {

		config = _.extend({}, config);

		return function (mixin, callback) {
			// Expiration is set at two weeks.
			// This paramter will be configurable in the future.
			var expiration = 1000 * 60 * 60 * 24 * 14;

			var newBearerAccount = {
				token: mixin.dataOut.tokenHash,
				strategy: 'bearer',
				expiration: expiration
			};

			mixin.accounts.push(newBearerAccount);

			callback(null, mixin);
		};

	}

	return BearerAddAccount;

})();