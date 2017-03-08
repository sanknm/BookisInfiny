'use strict';
// @flow

export default class BookShelfController {
     books;
     data;
     bookshelfService;
     currentYear;
     userService;
     Modal;
     bookReviewService;
     bookRatingService;
     /*@ngInject*/
     constructor(userService, Modal, chart, bookshelfService, moment, bookReviewService, bookRatingService) {
          this.bookshelfService = bookshelfService;
          this.userService = userService;
          this.bookReviewService = bookReviewService;
          this.bookRatingService = bookRatingService;
          this.Modal = Modal;
          this.books = userService.getBookShelf('all');
          this.readBooks = userService.getBookShelf('read');
          this.currentYear = moment().year();
          _.extend(this, chart.orderHistoryChart());
          userService.getBookShelfAggregation(undefined, this.currentYear).then(data => {
               this.data = data;
          });
     }

     updateBookShelf(book) {
          this.bookshelfService.updateBookshelf(book);
     }

     refreshChart(op) {
          op === '+' ? this.currentYear++ : this.currentYear--;
          this.userService.getBookShelfAggregation(undefined, this.currentYear);
     }

     rateBook(book) {
          this.Modal.rateBook(book, true)
               .then(({rate, review}) => {
                    if (review) this.bookReviewService.createReview({review}, book);
                    return this.bookRatingService.createRating(book, rate);
               })
               .then(rate => {
                    book.rating.ownerRate = rate
               })
               .catch(err => console.log('err', err));
     }

     sellBook(book) {
          this.Modal.sellBook(_.pick(book, ['isbn', 'title', 'author', 'format', 'year']))
               .then(b => this.userService.createBook(b))
               .catch(err => console.log('err', err));
     }

     markAsRead(book) {
          this.Modal.confirm('Mark as read', book.book.title).then(() => {
               book.read = true;
               this.bookshelfService.updateBookshelf(book)
                    .then(() => this.readBooks.push(book));
          });
     }
}
