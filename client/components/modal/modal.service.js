'use strict';

import angular from 'angular';

export function Modal($rootScope, $uibModal, Auth, $state, userService, moment, appConfig, $location, bookReviewService, $cookies, $window) {
     'ngInject';
     const me = Auth.getCurrentUserSync; //eslint-disable-line no-sync
     function openModal(modalScope = {}, windowClass = 'modal-default', size = 'md') {
          var scope = $rootScope.$new();

          angular.extend(scope, modalScope);

          return $uibModal.open({template: require('./modal.html'), windowClass, size, scope});
     }

     const modals = {
          confirm,
          login,
          signup,
          signupAsMerchant,
          sellBook,
          bulkSellBooks,
          editBook,
          rateBook,
          requestBook,
          fastBuy,
          crop
     };

     return modals;

     function confirm(action, name) {
          const confirmModal = openModal({
               modal: {
                    dismissable: false,
                    title: `Confirm ${action}`,
                    action,
                    name,
                    html: 'confirm.html',
                    confirm: () => confirmModal.close(),
                    cancel: () => confirmModal.dismiss()
               }
          }, 'center-modal');
          return confirmModal.result;
     }

     function login() {
          const data = {
               user: {remember: false},
               errors: {},
               notifications: {},
               states: {},
               local: $location.$$host === 'localhost',
               redirectState: $state.current.name === 'main' ? 'allbooks' : $state.current.name
          };

          function toggle(merchant) {
               loginModal.dismiss();
               modals[merchant ? 'signupAsMerchant' : 'signup']();
          }

          function submit(em, pa) {
               clean();
               Auth.login({
                    email: em || data.user.email,
                    password: pa || data.user.password
               })
                    .then(({role}) => {
                         $state.go(role === 'merchant' ? 'myzone.salesbooth' : data.redirectState);
                         loginModal.close();
                    })
                    .catch(err => {
                         data.errors.login = err.message;
                    });
          }

          function clean() {
               _.forOwn(data.errors, (v, k) => {
                    data.errors[k] = false;
               });
               _.forOwn(data.notifications, (v, k) => {
                    data.notifications[k] = false;
               });
          }

          function reset() {
               clean();
               data.states.reset = true;
               return userService.sendResetEmail(data.user)
                    .then(({message}) => {
                         data.states.reset = false;
                         data.states.forgot = false;
                         data.notifications.reset = message;
                    })
                    .catch(err => {
                         let error = err.data || err;
                         data.errors.reset = error;
                         data.states.reset = false;
                         data.states.offerResendVerification = /verified/.test(error);
                    });
          }

          function resend(email) {
               clean();
               data.states.resend = true;
               return userService.resendVerificationEmail(email)
                    .then(({message}) => {
                         data.states.resend = false;
                         data.notifications.resend = message;
                         data.errors.resend = false;
                    })
                    .catch(err => {
                         data.states.resend = false;
                         data.errors.resend = err.data || err;
                    });
          }

          const loginModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Login to our site',
                    description: 'Enter email and password to log in',
                    data,
                    submit,
                    reset,
                    resend,
                    clean,
                    toggle,
                    html: 'login.html'
               }
          }, 'center-modal', 'sm');
          return loginModal.result;
     }

     function signup() {
          const user = {};
          const errors = {};
          const redirectState = $state.current.name === 'main' ? 'allbooks' : $state.current.name;
          function toggle() {
               signupModal.dismiss();
               modals.login();
          }

          function submit(form) {
               Auth.createUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password
               })
                    .then(() => {
                         $state.go(redirectState);
                         signupModal.close();
                    })
                    .catch(err => {
                         err = err.data;
                         // Update validity of form fields that match the mongoose errors
                         angular.forEach(err.errors, (error, field) => {
                              form[field].$setValidity('mongoose', false);
                              errors[field] = error.message;
                         });
                    });
          }

          const signupModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Register',
                    description: 'Enables you to track orders and save time',
                    user,
                    errors,
                    submit,
                    toggle,
                    html: 'signup.html'
               }
          }, 'center-modal', 'sm');
          return signupModal.result;
     }

     function signupAsMerchant() {
          const user = {address: {}};
          const errors = {};
          const redirectState = 'myzone.salesbooth';
          function toggle() {
               signupModal.dismiss();
               modals.login();
          }

          function submit(form) {
               Auth.createUser(_.extend(user, {role: 'merchant'}))
                    .then(() => {
                         $state.go(redirectState);
                         signupModal.close();
                    })
                    .catch(err => {
                         err = err.data;
                         // Update validity of form fields that match the mongoose errors
                         angular.forEach(err.errors, (error, field) => {
                              form[field].$setValidity('mongoose', false);
                              errors[field] = error.message;
                         });
                    });
          }

          const signupModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Register as a merchant',
                    description: 'Enables you to sell your books online',
                    user,
                    errors,
                    submit,
                    toggle,
                    html: 'signup.merchant.html'
               }
          }, 'center-modal', 'sm');
          return signupModal.result;
     }

     function sellBook(book) {
          const sell = {book: book || {}};
          const SellBookModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'Sell book',
                    years: _.range(moment().year(), moment().year() - 250, -1),
                    sell,
                    formats: appConfig.books.formats,
                    conditions: appConfig.books.conditions,
                    confirm: () => SellBookModal.close(sell.book),
                    cancel: () => SellBookModal.dismiss(),
                    html: 'sell.book.html'
               }
          }, null, 'sm');
          return SellBookModal.result;
     }

     function bulkSellBooks() {
          const data = {};
          const BulkSellBooksModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'Add many books for sale',
                    required: ['ISBN', 'Title', 'Condition', 'Author', 'Price'],
                    data,
                    url: () => `${$window.location.origin}/api/exports/template?access_token=${$cookies.get('token')}`,
                    submit: () => BulkSellBooksModal.close(data.excelFile),
                    cancel: () => BulkSellBooksModal.dismiss(),
                    html: 'bulk.sell.books.html'
               }
          }, null, '');
          return BulkSellBooksModal.result;
     }

     function editBook(book) {
          const edit = {book: _.cloneDeep(book)};
          const EditBookModal = openModal({
               modal: {
                    dismissable: false,
                    title: 'Edit book',
                    years: _.range(moment().year(), moment().year() - 250, -1),
                    edit,
                    formats: appConfig.books.formats,
                    conditions: appConfig.books.conditions,
                    confirm: () => EditBookModal.close(edit.book),
                    cancel: () => EditBookModal.dismiss(),
                    html: 'edit.book.html'
               }
          }, null, 'sm');
          return EditBookModal.result;
     }

     function rateBook(book, owner) {
          const data = {
               book,
               rate: owner ? _.get(book, 'rating.ownerRate', 0) : 0,
               review: '',
               resolved: false
          };
          bookReviewService.getBookReviews(book, me()._id).then(rew => {
               data.resolved = true;
               data.alreadyReviewed = rew;
          });
          const RateBookModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Rate this book',
                    updateRating: ({rating}) => {
                         data.rate = rating;
                    },
                    data,
                    confirm: () => RateBookModal.close(data),
                    html: 'rate.book.html'
               }
          }, 'center-modal', 'sm');
          return RateBookModal.result;
     }

     function requestBook(book, showUserPartial) {
          const request = {
               book,
               showUserPartial
          };
          const options = {
               mapOptions: {
                    disableDefaultUI: true,
                    scrollwheel: false,
                    draggable: false,
                    disableDoubleClickZoom: true
               },
               markerOptions: {
                    draggable: false
               }
          };
          const RequestBookModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Request to buy this book',
                    request,
                    options,
                    confirm: () => RequestBookModal.close(_.pick(request, ['delivery', 'message'])),
                    html: 'request.book.html'
               }
          }, null, showUserPartial ? '' : 'sm');
          return RequestBookModal.result;
     }

     function fastBuy(book) {
          const request = {
               collapsed: true,
               book
          };
          const FastBuyModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Fast buy',
                    request,
                    confirm: () => FastBuyModal.close(_.pick(request, ['delivery', 'message'])),
                    html: 'fast.buy.html'
               }
          }, null, '');
          return FastBuyModal.result;
     }

     function crop(file) {
          const image = {
               file,
               cropped: undefined
          };
          const CropModal = openModal({
               modal: {
                    dismissable: true,
                    title: 'Position and Size Your Photo',
                    image,
                    crop: () => CropModal.close(image),
                    html: 'crop.html'
               }
          }, 'center-modal', 'sm');
          return CropModal.result;
     }
}

export default angular.module('bookisApp.Modal', [])
     .factory('Modal', Modal)
     .name;
