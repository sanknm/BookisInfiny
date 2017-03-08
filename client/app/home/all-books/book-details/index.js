'use strict';

import angular from 'angular';
import BookDetailsController from './book-details.controller';
import bookSeller from './seller';
import routing from './book-details.routes';

export default angular.module('bookisApp.bookdetails', [bookSeller])
     .config(routing)
     .controller('BookDetailsController', BookDetailsController)
     .name;
