'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarSubComponent {
     menu = [{
          title: 'All books',
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

export default angular.module('directives.navbarsub', [])
     .component('navbarSub', {
          template: require('./navbar-sub.html'),
          controller: NavbarSubComponent
     })
     .name;
