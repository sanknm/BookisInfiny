import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
     $http;

     /*@ngInject*/
     constructor($http, $stateParams, Auth, $state, Modal) {
          'ngInject';
          this.$http = $http;
          if ($stateParams.openLogin) {
               Modal.login();
          }
          if ($stateParams.jwt) {
               console.log('$stateParams.jwt :', $stateParams.jwt);
               console.log('$stateParams.redirect :', $stateParams.redirect);
               Auth.loginWithToken($stateParams.jwt).then(() => {
                    $state.go($stateParams.redirect);
               });
          }
     }

}

export default angular.module('bookisApp.main', [uiRouter])
     .config(routing)
     .component('main', {
          template: require('./main.html'),
          controller: MainController
     })
     .name;
