'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
     menu = [{
          title: 'Books',
          icon: 'fa fa-bars',
          state: 'allbooks'
     }, {
          title: 'Student',
          state: 'student'
     }, {
          title: 'Kids',
          state: 'kids'
     }, {
          title: 'Top 100',
          state: 'top100'
     }];
     isLoggedIn:Function;
     isAdmin:Function;
     isMerchant:Function;
     getCurrentUser:Function;
     Modal:Function;
     isCollapsed = true;
     openLogin:Function;

     constructor(Auth, Modal) {
          'ngInject';
          this.Modal = Modal;
          this.isLoggedIn = Auth.isLoggedInSync;
          this.isAdmin = Auth.isAdminSync;
          this.isMerchant = Auth.isMerchantSync;
          this.getCurrentUser = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.openLogin = Modal.login;
     }
}

export default angular.module('directives.navbar', [])
     .component('navbar', {
          template: require('./navbar.html'),
          controller: NavbarComponent
     })
     .name;
