'use strict';
// @flow

export default class FollowingController {
     me;
     userService;
     /*@ngInject*/
     constructor(Auth, userService, me) {
          this.userService = userService;
          this.me = me;
     }
     
     unfollow({_id}) {
          this.userService.toggleFollow(_id);
     }

}
