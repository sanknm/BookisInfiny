'use strict';

export default class AdminController {
     users;
     Modal;

     /*@ngInject*/
     constructor(UserAPI, Modal) {
          this.users = UserAPI.query();
          this.Modal = Modal;
     }

     deleteUser(user) {
          this.Modal.confirm('Delete', `${user.firstName} ${user.lastName}`)
               .then(() => {
                    user.$remove();
                    this.users.splice(this.users.indexOf(user), 1);
               });
     }
}
