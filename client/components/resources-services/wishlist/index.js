'use strict';

import angular from 'angular';
import {WishlistResource} from './wishlist.resource';
import {WishlistService} from './wishlist.service';

export default angular.module('bookisApp.wishlist', [])
     .service('WishlistAPI', WishlistResource)
     .service('wishlistService', WishlistService)
     .name;
