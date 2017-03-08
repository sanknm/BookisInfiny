'use strict';

import angular from 'angular';
import SalesBoothController from './sales-booth.controller';
import active from './active';
import pending from './pending';
import waiting from './waiting';
import routing from './sales-booth.routes';

export default angular.module('bookisApp.salesbooth', [active, pending, waiting])
     .config(routing)
     .controller('SalesBoothController', SalesBoothController)
     .name;
