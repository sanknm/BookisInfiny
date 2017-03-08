import angular from 'angular';

export class UserProfileController {
     items;
     login:Function;
     following:Function = (list, _id) => _.includes(_.map(list, '_id'), _id);
     mapOptions = {
          disableDefaultUI: true,
          scrollwheel: false,
          draggable: false,
          disableDoubleClickZoom: true
     };
     markerOptions = {
          draggable: false
     };
     me;
     Modal;
     requestService;
     userService;
     /*@ngInject*/
     constructor(Auth, Modal, requestService, userService) {
          'ngInject';
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.Modal = Modal;
          this.requestService = requestService;
          this.userService = userService;
          this.login = Modal.login;
     }
     
     $onInit() {
          this.items = [
               {name: 'Activity', template: '_activity.html'},
               {name: 'Followers', template: '_followers.html', number: this.user.followers},
               {name: 'Following', template: '_following.html', number: this.user.following},
               {name: 'Have Read', template: '_have.read.html', number: this.bookshelf},
               {name: 'Wishlist', template: '_wishlist.html', number: this.wishlist},
               {name: 'Books for sale', template: '_books.for.sale.html', number: this.books},
               {name: 'Shipping & Return Policy', template: '_shipping.return.html'}
          ]
     }
     
     requestBook(book) {
          this.Modal.requestBook(book, false)
               .then(({delivery, message}) => {
                    const request = {
                         book: book._id,
                         owner: book.user,
                         delivery, message
                    };
                    this.requestService.createRequest(request);
               });
     }

     toggleFollow({_id}) {
          this.userService.toggleFollow(_id);
     }
}

export default angular.module('bookisApp.userprofile', [])
     .component('bookisUserProfile', {
          template: require('./bookis-user-profile.html'),
          bindings: {
               user: '<',
               wishlist: '<',
               bookshelf: '<',
               books: '<'
          },
          controllerAs: 'vm',
          controller: UserProfileController
     })
     .name;
