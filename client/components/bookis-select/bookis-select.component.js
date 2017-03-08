'use strict';

import angular from 'angular';

export class BookisSelectController {
     bind;

     /*@ngInject*/
     constructor() {
          'ngInject';
          this.mychange = (type, value) => {
               this.change({type, value});
          };
     }

}

export default angular.module('bookisApp.bookisselect', [])
     .component('bookisSelect', {
          template: require('./bookis-select.html'),
          bindings: {
               placeholder: '@',
               name: '@',
               model: '=',
               options: '<',
               required: '<',
               change: '&?',
               id: '@'
          },
          controllerAs: 'vm',
          controller: BookisSelectController
     })
     .name;
