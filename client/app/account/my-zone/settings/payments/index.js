'use strict';

import angular from 'angular';
import PaymentsController from './payments.controller';

export default angular.module('bookisApp.payments', [])
     .controller('PaymentsController', PaymentsController)
     .name;
