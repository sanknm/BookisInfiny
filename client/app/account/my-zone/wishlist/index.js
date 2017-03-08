'use strict';

import angular from 'angular';
import WishListController from './wishlist.controller';

export default angular.module('bookisApp.wishlists', [])
     .controller('WishListController', WishListController)
     .name;
