'use strict';
// @flow

export default class MyZoneController {
     Auth;
     me;
     isMerchant:Function;
     getLength = arrays => _.reduce(arrays, (agg, array) => agg + array.length, 0);
     /*@ngInject*/
     constructor(Auth, me, $mdSidenav, userService) {
          this.me = me;
          this.Auth = Auth;
          this.isMerchant = Auth.isMerchantSync();
          this.$mdSidenav = $mdSidenav;
          this.navigationItems = [{
               title: 'Dashboard',
               state: '.dashboard'
          }, {
               title: 'Messages',
               state: '.messages'
          }, {
               title: 'People',
               state: '.people'
          }, {
               title: 'Sales Booth',
               state: '.salesbooth',
               number: userService.getRequests(['pending', 'waiting'], 'incoming', 'unseen')
          }, {
               title: 'Wishlist',
               state: '.wishlist',
               hide: this.isMerchant,
               number: [userService.getWishList()]
          }, {
               title: 'Bookshelf',
               state: '.bookshelf',
               hide: this.isMerchant,
               number: [userService.getBookShelf('all')]
          }, {
               title: 'Order History',
               state: '.orderhistory',
               hide: this.isMerchant,
               number: userService.getRequests(['pending', 'waiting', 'delivered'], 'sent', 'unseen')
          }, {
               title: 'Sales History',
               state: '.saleshistory',
               number: userService.getRequests(['delivered'], 'incoming', 'unseen')
          }, {
               title: 'Settings',
               state: '.settings'
          }, {
               title: 'Logout',
               state: 'logout'
          }];
     }

     toggle() {
          this.$mdSidenav('left').toggle();
     }

     closeSidenav() {
          this.$mdSidenav('left').isOpen() && this.$mdSidenav('left').close();
     }

}
