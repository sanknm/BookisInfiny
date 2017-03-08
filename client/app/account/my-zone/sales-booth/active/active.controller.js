'use strict';
// @flow

export default class ActiveController {
     books;
     userService;
     Modal;
     bookRatingService;
     bookReviewService;
     bookService;
     me;
     round = _.round;
     /*@ngInject*/
     constructor(Modal, userService, bookRatingService, me, bookReviewService, bookService) {
          this.Modal = Modal;
          this.userService = userService;
          this.bookRatingService = bookRatingService;
          this.bookReviewService = bookReviewService;
          this.bookService = bookService;
          this.me = me;
          this.books = userService.getBooks('activeAndRequested');
     }

     sellBook() {
          this.Modal.sellBook()
               .then(b => this.userService.createBook(b))
               .catch(err => console.log('err', err));
     }

     bulkSell() {
          this.Modal.bulkSellBooks()
               .then(file => this.bookService.bulkBookImport(file))
               .then(books => this.userService.addBulkBooks(books));
     }

     editBook(book) {
          this.Modal.editBook(book)
               .then(b => this.userService.editBook(b))
               .catch(err => console.log('err', err));
     }

     remove(book) {
          this.Modal.confirm('Delete', book.title)
               .then(() => this.userService.removeBook(book))
               .catch(err => console.log('err', err));
     }

     rateBook(book) {
          this.Modal.rateBook(book, true)
               .then(({rate, review}) => {
                    if (review) this.bookReviewService.createReview({review}, book);
                    return this.bookRatingService.createRating(book, rate);
               })
               .then(rate => this.userService.updateBookRating(book, rate))
               .catch(err => console.log('err', err));
     }
}
