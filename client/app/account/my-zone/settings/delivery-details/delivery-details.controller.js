'use strict';
// @flow

export default class DeliveryDetailsController {
     me;
     shippingDurations;
     map;
     userService;
     autoComplete;
     mapOptions = {
          scrollwheel: false
     };
     markerOptions = {
          draggable: false
     };
     isEqual = _.isEqual;
     omit = _.omit;

     /*@ngInject*/
     constructor(me, appConfig, userService) {
          this.me = me;
          this.origin = _.cloneDeep(this.me);
          this.userService = userService;
          this.autoComplete = this.me.address.coordinates.length ? userService.generateFullAddress(this.me.address) : '';
          this.shippingDurations = appConfig.shippingDurations;
     }

     update(form, type) {
          this.userService.updateCurrentUser(this, form, type);
     }

}
