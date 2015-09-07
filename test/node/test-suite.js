'use strict';

global.Promise = require('es6-promise').Promise;

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

require('./unit/config.js');
require('./unit/baseUrlIntegrity.js');
require('./unit/corbel.js');
require('./unit/validate.js');
require('./unit/request.js');
require('./unit/jwt.js');
require('./unit/iam.js');
require('./unit/resources.js');
require('./unit/resources-request-params.js');
require('./unit/services.js');
require('./unit/assets.js');
require('./unit/oauth.js');
require('./unit/notifications.js');
require('./unit/ec.js');
require('./unit/evci.js');
require('./unit/borrow.js');
require('./unit/composr.js');
