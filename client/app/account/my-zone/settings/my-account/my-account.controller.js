'use strict';
// @flow

type User = {
     firstName:string,
     lastName:string,
     about:string,
     gender:string
}

export default class MyAccountController {
     me:User;
     origin:User;
     isEqual:Function;
     userService;
     Modal;
     genders;
     image = {
          base64: '',
          uploading: false
     };

     /*@ngInject*/
     constructor(me, userService, Modal, appConfig) {
          this.me = _.cloneDeep(me);
          this.origin = _.cloneDeep(me);
          this.userService = userService;
          this.isEqual = _.isEqual;
          this.Modal = Modal;
          this.genders = appConfig.genders;
     }

     update(form) {
          this.userService.updateCurrentUser(this, form, 'profile');
     }

     upload(image) {
          this.userService.updateCurrentUserProfileImage(image, this);
     }

     openCropModal(file) {
          this.Modal.crop(file)
               .then(img => {
                    this.image.base64 = img.cropped;
               })
               .catch(err => console.log('Err :', err));
     }

}
