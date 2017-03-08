import angular from 'angular';

export class FollowingController {
     alreadyFollowing:Boolean;
     follow:Function;
     unfollow:Function;
     /*@ngInject*/
     constructor() {
          'ngInject';
          this.$onInit = () => {
               this.alreadyFollowing = _.findIndex(this.following, {_id: this.data._id}) >= 0;
          };
     }

     followUser(_id) {
          this.follow({_id});
          this.alreadyFollowing = true;
     }
}

export default angular.module('bookisApp.follow', [])
     .component('followPanel', {
          template: require('./follow-panel.html'),
          bindings: {
               data: '<',
               follow: '&?',
               following: '<',
               unfollow: '&?',
               controls: '<'
          },
          controllerAs: 'vm',
          controller: FollowingController
     })
     .name;
