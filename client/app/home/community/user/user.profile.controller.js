'use strict';
// @flow

export default class UserProfileController {
     user;
     books;
     wishlist;
     bookshelf;
     /*@ngInject*/
     constructor(userService, user) {
          this.user = user;
          this.books = userService.getBooks('active');
          this.wishlist = userService.getWishList();
          this.bookshelf = userService.getBookShelf('all');
     }
}
