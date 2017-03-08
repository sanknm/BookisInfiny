'use strict';
// @flow

export default class BookDetailsController {
     book;
     myRate;
     ratings;
     total;
     average;
     bookRatingService;
     bookReviewService;
     bookReplyService;
     wishlistService;
     round:Function;
     me;
     Modal;
     requestService;
     alreadyRequested;
     alreadyWishListed;
     reviews;
     timeout;
     appConfig;
     social;
     includes = _.includes;
     /*@ngInject*/
     constructor(book, ratings, myRate, alreadyRequested, alreadyWishListed, bookRatingService, wishlistService, bookReviewService, bookReplyService,
                 Auth, Modal, requestService, $timeout, appConfig) {
          this.timeout = $timeout;
          this.appConfig = appConfig;
          this.book = book;
          this.round = _.round;
          this.book.summary = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adm ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adm ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut beatae debitis dignissimos est exercitationem illum inventore laboriosam nam odio optio pariatur praesentium quis sit tempore tenetur, vel, veniam voluptate.Consequuntur cumque cupiditate dolores doloribus eius ex excepturi, fugit harum minus nesciunt nostrum ratione rem, repellendus sequi sit sunt tempore unde voluptate.';//eslint-disable-line max-len
          this.bookRatingService = bookRatingService;
          this.bookReviewService = bookReviewService;
          this.bookReplyService = bookReplyService;
          this.requestService = requestService;
          this.wishlistService = wishlistService;
          this.Modal = Modal;
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.myRate = myRate;
          this.average = bookRatingService.getAverage;
          this.alreadyRequested = alreadyRequested;
          this.alreadyWishListed = alreadyWishListed;
          this.ratings = ratings;
          this.total = bookRatingService.getTotal();
          this.social = _.initial(appConfig.social);
          bookReviewService.getBookReviews(book).then(rev => {
               this.reviews = rev;
               if (_.isEmpty(this.reviews)) return;
               bookReviewService.getReviewReplies(this.book, this.reviews[0]);//most replies
               _.each(this.reviews, (e, i) => {
                    e.amFilter = (new Date().getTime() - new Date(e.createdAt).getTime()) / 1000 / 60 / 60 < 24;
                    e.collapsed = i !== 0;
               });
          });
     }

     crateRating({rating}) {
          this.bookRatingService.createRating(this.book, rating)
               .then(r => this.bookRatingService.syncRates(r));
     }

     updateRating({rating}) {
          const oldRate = _.clone(_.get(this, 'myRate[0].rate'));
          this.bookRatingService.updateRating(this.myRate, rating)
               .then(r => this.bookRatingService.syncRates(r, oldRate));
     }

     requestBook() {
          if (!this.me()._id) return;
          this.Modal.requestBook(this.book, true)
               .then(({delivery, message}) => {
                    const request = {
                         book: this.book._id,
                         owner: this.book.user._id,
                         delivery, message
                    };
                    this.requestService.createRequest(request)
                         .then(r => this.alreadyRequested.push(r));
               });
     }

     login() {
          this.Modal.login();
     }

     reviewBook(review) {
          this.bookReviewService.createReview({review}, this.book)
               .then(() => {
                    this.review = '';
               });
     }

     showReplyPartial(id, i) {
          _.each(this.reviews, el => {
               el.showReply = el._id.toString() === id.toString();
          });
          this.timeout(() => $(`#reply${i}`).focus(), 200);
     }

     createReply(review) {
          this.bookReviewService.replyToReview(this.book, review, this.reply)
               .then(() => {
                    review.collapsed = false;
                    this.reply = '';
               });
     }

     getReplies(review) {
          this.bookReviewService.getReviewReplies(this.book, review);
     }

     getStatus() {
          switch (_.get(this, 'alreadyRequested[0].status')) {
               case 'pending': return 'Request pending';//eslint-disable-line indent
               case 'waiting': return 'Waiting for delivery';//eslint-disable-line indent
               case 'declined': return 'Request declined';//eslint-disable-line indent
          }
     }

     expanding(review) {
          if (!review.fetched && review.noReplies) {
               this.bookReviewService.getReviewReplies(this.book, review);
          }
     }

     toggleReviewLike(review) {
          this.bookReviewService.toggleReviewLike(this.book, review);
     }

     toggleReplyLike(review, reply) {
          this.bookReplyService.toggleReplyLike(this.book, review, reply);
     }

     shareUrl() {
          return `${this.appConfig.envData.DOMAIN}/all-books/${this.book._id}/details`;
     }

     addToWishList() {
          this.wishlistService.createWishList(this.book)
               .then(wl => this.alreadyWishListed.push(wl));
     }

     notReviewed() {
          return this.me()._id ? !_.includes(_.map(this.reviews, 'user._id'), this.me()._id.toString()) : true;
     }

}
