'use strict';
// @flow

export default class WishListController {
     wishlist;
     wishlistService;
     bookshelfService;
     requestService;
     userService;
     Modal;
     alreadyRequested;
     /*@ngInject*/
     constructor(userService, wishlistService, Modal, requestService, bookshelfService) {
          this.wishlistService = wishlistService;
          this.bookshelfService = bookshelfService;
          this.requestService = requestService;
          this.userService = userService;
          this.wishlist = userService.getWishList();
          this.Modal = Modal;
          this.alreadyRequested = userService.alreadyRequested;
     }

     updateWishList(wl) {
          this.wishlistService.updateWishList(wl);
     }

     moveToBookshelf(wl) {
          this.Modal.confirm('Move to bookshelf', wl.book.title)
               .then(() => {
                    wl.active = false;
                    return this.wishlistService.updateWishList(wl)
               })
               .then(() => this.bookshelfService.createBookshelf(wl.book))
               .then(bs => this.userService.createBookshelfHandler(bs))
     }

     fastBuy(book) {
          this.Modal.fastBuy(book)
               .then(({delivery, message}) => {
                    const request = {
                         book: book._id,
                         owner: book.user,
                         delivery, message
                    };
                    this.requestService.createRequest(request)
                         .then(req => this.userService.createRequestHandler(req))
               })
     }
}
