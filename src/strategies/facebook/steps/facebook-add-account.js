var _ = require('underscore');

module.exports = (function () {
	'use strict';

	function FacebookAddAccount (config) {

		config = _.extend({}, config);

		return function (mixin, callback) {
			var expiration = mixin.data.expiration;

			if(mixin.stateIn === 'initial') {

				var newFacebookAccount = {
					expiration: expiration,
					strategy: 'facebook',

					oauthId: mixin.data.oauthId,
					accessToken: mixin.data.accessToken,
					refreshToken: mixin.data.refreshToken
				};

				mixin.stateOut = 'registered';

				mixin.accounts.unshift(newFacebookAccount);

			}

			callback(null, mixin);
		};

	}

	return FacebookAddAccount;

})();
