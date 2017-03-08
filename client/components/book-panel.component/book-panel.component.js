import angular from 'angular';

export class BookPanelController {
     book;

     /*@ngInject*/
     constructor() {
          'ngInject';
     }

}

export default angular.module('bookisApp.bookpanel', [])
     .component('bookPanel', {
          template: require('./book-panel.html'),
          bindings: {
               book: '<',
               user: '<',
               click: '&'
          },
          controllerAs: 'vm',
          controller: BookPanelController
     })
     .name;
