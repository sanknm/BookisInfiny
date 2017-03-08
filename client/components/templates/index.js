'use strict';

import angular from 'angular';

export default angular.module('bookisApp.templates', [])
     .run(['$templateCache', $templateCache => {
          $templateCache.put('login.html', require('../modal/templates/login/login.html'));
          $templateCache.put('crop.html', require('../modal/templates/crop/crop.html'));
          $templateCache.put('edit.book.html', require('../modal/templates/edit-book/edit.book.html'));
          $templateCache.put('rate.book.html', require('../modal/templates/rate-book/rate.book.html'));
          $templateCache.put('request.book.html', require('../modal/templates/request-book/request.book.html'));
          $templateCache.put('sell.book.html', require('../modal/templates/sell-book/sell.book.html'));
          $templateCache.put('bulk.sell.books.html', require('../modal/templates/bulk-sell-books/bulk.sell.books.html'));
          $templateCache.put('signup.html', require('../modal/templates/signup/signup.html'));
          $templateCache.put('signup.merchant.html', require('../modal/templates/signup.merchant/signup.merchant.html'));
          $templateCache.put('fast.buy.html', require('../modal/templates/fast-buy/fast.buy.html'));
          $templateCache.put('confirm.html', require('../modal/templates/confirm.html'));
          $templateCache.put('_activity.html', require('../../components/bookis-user-profile/_activity.html'));
          $templateCache.put('_followers.html', require('../../components/bookis-user-profile/_followers.html'));
          $templateCache.put('_following.html', require('../../components/bookis-user-profile/_following.html'));
          $templateCache.put('_have.read.html', require('../../components/bookis-user-profile/_have.read.html'));
          $templateCache.put('_shipping.return.html', require('../../components/bookis-user-profile/_shipping.return.html'));
          $templateCache.put('_books.for.sale.html', require('../../components/bookis-user-profile/_books.for.sale.html'));
          $templateCache.put('_wishlist.html', require('../../components/bookis-user-profile/_wishlist.html'));
          $templateCache.put('_user.html', require('../../app/account/my-zone/settings/my-account/_user.html'));
          $templateCache.put('_merchant.html', require('../../app/account/my-zone/settings/my-account/_merchant.html'));
     }])
     .name;
