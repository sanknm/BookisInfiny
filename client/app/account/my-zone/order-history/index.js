'use strict';

import angular from 'angular';
import OrderHistoryController from './order-history.controller';

export default angular.module('bookisApp.oriderhistory', [])
     .controller('OrderHistoryController', OrderHistoryController)
     .name;
