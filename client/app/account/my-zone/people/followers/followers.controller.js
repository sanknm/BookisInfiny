'use strict';
// @flow

export default class FollowersController {
     me;
     userService;
     /*@ngInject*/
     constructor(me, userService) {
          this.me = me;
          this.userService = userService;
     }

     follow({_id}) {
          this.userService.toggleFollow(_id);
     }

}
