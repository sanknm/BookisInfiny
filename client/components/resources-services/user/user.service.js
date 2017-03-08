'use strict';

export function UserService(UserAPI, Auth, Upload, Util, toast, requestService, bookService) {
     'ngInject';

     const generateFullAddress = ({streetAddress = '', streetNumeric = '', zip = '', city = '', country = ''}) => `${streetAddress} ${streetNumeric}, ${zip}, ${city} ${country}`;
     let me = Auth.getCurrentUserSync;//eslint-disable-line no-sync

     const requestStatuses = ['pending', 'declined', 'waiting', 'delivered'];
     const data = {
          books: {
               all: [], //private
               active: [],
               requested: [],
               activeAndRequested: [],
               sold: []
          },
          requests: {
               incoming: {
                    all: [], //private
                    aggregated: [],
                    pending: {
                         all: [],
                         unseen: []
                    },
                    waiting: {
                         all: [],
                         unseen: []
                    },
                    delivered: {
                         all: [],
                         unseen: []
                    },
                    declined: {
                         all: [],
                         unseen: []
                    }
               },
               both: {
                    all: [],
                    withMessages: {
                         all: []
                    }
               },
               sent: {
                    all: [], //private
                    aggregated: [],
                    pending: {
                         all: [],
                         unseen: []
                    },
                    waiting: {
                         all: [],
                         unseen: []
                    },
                    delivered: {
                         all: [],
                         unseen: []
                    },
                    declined: {
                         all: [],
                         unseen: []
                    }
               }
          },
          wishlist: {
               all: []
          },
          bookshelf: {
               all: [],
               read: [],
               aggregation: []
          }
     };

     return {
          getUser,
          getUsers,
          verifyEmail,
          resendVerificationEmail,
          resetPasswordWithToken,
          sendResetEmail,
          updateCurrentUser,
          updateCurrentUserProfileImage,
          updateNotification,
          changePassword,
          setPassword,
          generateFullAddress,
          getUserBooks,
          getBooks: type => data.books[type],
          updateBookRating,
          getUserRequests,
          getUserIncomingRequests,
          getUserSentRequests,
          getUserWishList,
          getUserBookshelf,
          fetchRequests: (direction, state, type) => data.requests[direction][state][type],
          approveRequest: req => requestService.approveRequest(req).then(handleApprovedRequests(req)),
          declineRequest: req => requestService.declineRequest(req).then(handleDeclinedRequests(req)),
          deliverRequest: req => requestService.deliverRequest(req).then(handleDeliveredRequests(req)),
          cancelRequest: req => requestService.cancelRequest(req).then(handleCanceledRequests(req)),
          createBook: book => bookService.createBook(book).then(handleCreatedBook),
          addBulkBooks: books => {
               data.books.activeAndRequested.push(...books);
               data.books.all.push(...books);
               data.books.active.push(...books);
          },
          editBook: book => bookService.editBook(book).then(handleEditedBook),
          removeBook: book => bookService.removeBook(book).then(handleRemovedBook),
          getRequests: (states, direction, type) => _.reduce(states, (agg, state) => agg.concat([data.requests[direction][state][type]]), []),
          getWishList: () => data.wishlist.all,
          getBookShelf: type => data.bookshelf[type],
          alreadyRequested: _id => _.findIndex(data.requests.sent.all, e => _.includes(['pending', 'waiting'], e.status) && e.book._id === _id) >= 0,
          markAsSeen,
          getRequestsAggregation,
          getBookShelfAggregation,
          toggleFollow,
          createRequestHandler,
          createBookshelfHandler
     };

     function getUsers() {
          return null;
     }
     
     function getUser(id) {
          return UserAPI.get({id}).$promise
               .then(user => user)
               .catch(err => console.log(err));
     }

     function verifyEmail(token) {
          return UserAPI.verifyEmail({token}).$promise;
     }

     function resendVerificationEmail(email) {
          return UserAPI.resendVerificationEmail({email}).$promise;
     }

     function resetPasswordWithToken(_data) {
          return UserAPI.resetPasswordWithToken(_data).$promise;
     }

     function sendResetEmail(user) {
          return UserAPI.sendResetEmail(user).$promise;
     }

     function updateCurrentUser(ctrl, form, type) {
          return UserAPI.updateCurrentUser(ctrl.me).$promise
               .then(() => {
                    Auth.updateCurrentUser(ctrl.me);
                    if (form) Util.resetForm(form);
                    if (ctrl.origin) ctrl.origin = _.cloneDeep(ctrl.me);
                    toast.simple(`Successfully updated ${type}!`);
               })
               .catch(err => console.log(err));
     }

     function updateCurrentUserProfileImage(image, ctrl) {
          const file = Upload.dataUrltoBlob(image.base64, 'profile_image');
          image.uploading = true;
          Upload.upload({method: 'PATCH', url: `api/users/${ctrl.me._id}/profile`, data: {file}})
               .then(({data: _data}) => {
                    ctrl.me.imageUrl = _data;
                    Auth.updateCurrentUser({imageUrl: _data});
                    image.uploading = false;
                    image.base64 = null;
                    ctrl.origin = _.cloneDeep(ctrl.me);
                    toast.simple('Profile image uploaded successfully!');
               }, err => {
                    console.log('Err :', err);
                    image.uploading = false;
               });
     }

     function updateNotification(_id, notification) {
          UserAPI.updateNotification(_.extend({_id}, notification)).$promise
               .then(() => toast.simple('Notification updated!', 100));
     }

     function changePassword(ctrl, form) {
          if (form.$valid) {
               Auth.changePassword(ctrl.user.oldPassword, ctrl.user.newPassword)
                    .then(() => {
                         Util.resetForm(form);
                         _.forOwn(ctrl.user, (v, k) => {
                              ctrl.user[k] = '';
                         });
                         toast.simple('Successfully changed password!');
                    })
                    .catch(() => {
                         form.password.$setValidity('mongoose', false);
                         ctrl.errors.other = 'Incorrect password';
                    });
          }
     }

     function setPassword(ctrl, form) {
          const password = _.get(ctrl, 'user.newPassword');
          if (form.$valid) {
               UserAPI.setPassword({password}).$promise
                    .then(() => {
                         Util.resetForm(form);
                         _.forOwn(ctrl.user, (v, k) => {
                              ctrl.user[k] = '';
                         });
                         toast.simple('Password is set!');
                    })
                    .catch(() => {
                         form.password.$setValidity('mongoose', false);
                         ctrl.errors.other = 'Incorrect password';
                    });
          }
     }

     function getUserBooks(user) {
          return UserAPI.getBooks({id: user._id}).$promise
               .then(b => {
                    Util.bindArray(data.books.all, b);
                    Util.bindArray(data.books.activeAndRequested, _.filter(data.books.all, e => _.includes(['active', 'requested'], e.status) && e.active));
                    Util.bindArray(data.books.requested, _.filter(data.books.all, {status: 'requested', active: true}));
                    Util.bindArray(data.books.active, _.filter(data.books.all, {status: 'active', active: true}));
                    Util.bindArray(data.books.sold, _.filter(data.books.all, {status: 'sold', active: true}));
                    return data.books.all;
               })
               .catch(err => console.log(err));
     }

     function updateBookRating(book, rate) {
          const ownerRate = _.get(book, 'rating.ownerRate');
          const oldVotes = _.get(book, 'rating.votes');
          const oldAvg = _.get(book, 'rating.avg');
          _.each([data.books.all], el => {
               const index = _.findIndex(el, {_id: book._id});
               if (ownerRate) {
                    let newTotal = oldAvg * oldVotes - ownerRate;
                    newTotal += rate;
                    el[index].rating.ownerRate = rate;
                    el[index].rating.avg = newTotal / oldVotes;
               } else {
                    el[index].rating.ownerRate = rate;
                    el[index].rating.avg = (oldVotes * oldAvg + rate) / (oldVotes + 1);
                    el[index].rating.votes++;
               }
          });
     }

     function getUserRequests({_id: id}) {
          if (!id) id = me()._id;
          if (!id) return Promise.resolve([]);
          return UserAPI.getRequests({id}).$promise
               .then(allRequests => {
                    Util.bindArray(data.requests.both.all, allRequests);
                    Util.bindArray(data.requests.both.withMessages.all, _.filter(data.requests.both.all, 'message'));
                    const partition = _.partition(allRequests, e => e.owner._id === id);
                    _.each(['incoming', 'sent'], (direction, i) => {
                         Util.bindArray(data.requests[direction].all, partition[i]);
                         _.each(requestStatuses, status => {
                              Util.bindArray(data.requests[direction][status].all, _.filter(partition[i], {status}));
                              Util.bindArray(data.requests[direction][status].unseen, _.filter(data.requests[direction][status].all, e => !e.seen[direction === 'incoming' ? 'user' : 'owner']));
                         });
                    });
                    console.log('Data :', data);
               })
               .catch(err => console.log(err));
     }

     function getUserIncomingRequests(user) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          return UserAPI.getIncomingRequests(query).$promise
               .then(incoming => {
                    Util.bindArray(data.requests.incoming.all, incoming);
                    _.each(requestStatuses, status => {
                         Util.bindArray(data.requests.incoming[status].all, _.filter(incoming, {status}));
                         Util.bindArray(data.requests.incoming[status].unseen, _.filter(data.requests.incoming[status].all, e => !e.seen.user));
                    });
                    return data.requests.incoming.all;
               })
               .catch(err => console.log(err));
     }

     function getUserSentRequests(user, book) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          if (book) query.bookId = book._id;
          return UserAPI.getSentRequests(query).$promise
               .then(sent => {
                    // Util.bindArray(data.requests.sent.all, sent);
                    // _.each(requestStatuses, status => {
                    //      Util.bindArray(data.requests.sent[status].all, _.filter(sent, {status}));
                    //      Util.bindArray(data.requests.sent[status].unseen, _.filter(data.requests.sent[status].all, e => !e.seen.owner));
                    // });
                    return sent;
               })
               .catch(err => console.log(err));
     }

     function getRequestsAggregation(direction, user, year, statuses) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          return UserAPI[direction === 'incoming' ? 'getIncomingRequestsAggregation' : 'getSentRequestsAggregation'](_.extend(query, {year, statuses})).$promise
               .then(sent => {
                    Util.bindArray(data.requests[direction].aggregated, sent);
                    return data.requests[direction].aggregated;
               })
               .catch(err => console.log(err));
     }

     function getUserWishList(user, book) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          if (book) query.bookId = book._id;
          return UserAPI.getWishList(query).$promise
               .then(wl => {
                    if (query.bookId) return wl;
                    Util.bindArray(data.wishlist.all, wl);
                    return data.wishlist.all;
               })
               .catch(err => console.log(err));
     }

     function getUserBookshelf(user) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          return UserAPI.getBookshelf(query).$promise
               .then(bs => {
                    Util.bindArray(data.bookshelf.all, bs);
                    Util.bindArray(data.bookshelf.read, _.filter(bs, 'read'));
                    return data.bookshelf.all;
               })
               .catch(err => console.log(err));
     }
     
     function getBookShelfAggregation(user, year) {
          if (!user) user = me();
          if (!user._id) return Promise.resolve([]);
          const query = {id: user._id};
          return UserAPI.getBookShelfAggregation(_.extend(query, {year})).$promise
               .then(bs => {
                    Util.bindArray(data.bookshelf.aggregation, bs);
                    return data.bookshelf.aggregation;
               })
               .catch(err => console.log(err));
     }

     function markAsSeen(direction, statuses, type) {
          _.each(statuses, status => {
               if (_.isEmpty(data.requests[direction][status].unseen)) return;
               const notSeenIds = _.map(data.requests[direction][status].unseen, '_id');
               requestService.markSeen(notSeenIds, type)
                    .then(() => {
                         _.each(notSeenIds, _id => {
                              const index = _.findIndex(data.requests[direction][status].all, {_id});
                              data.requests[direction][status].all[index].seen[type] = new Date();
                         });
                         data.requests[direction][status].unseen.splice(0);
                    })
                    .catch(err => console.log('err: ', err));
          });
     }
     
     function toggleFollow(userId) {
          return UserAPI.toggleFollow({_id: me()._id, userId}).$promise
               .then(following => {
                    toast.simple('Following status updated!');
                    Auth.updateFollowerList(following);
                    return following;
               })
               .catch(err => console.log('err: ', err));
     }

     /* BOOK HANDLERS */
     function handleCreatedBook(b) {
          _.each([data.books.all, data.books.active], el => el.unshift(b));
          _.each([data.books.all, data.books.activeAndRequested], el => el.unshift(b));
     }
     function handleEditedBook(b) {
          _.each([data.books.all, data.books.active, data.books.activeAndRequested], el => {
               let index = _.findIndex(el, {_id: b._id});
               el[index] = b;
          });
     }
     function handleRemovedBook(b) {
          _.each([data.books.all, data.books.active, data.books.activeAndRequested], el => {
               let index = _.findIndex(el, {_id: b._id});
               el.splice(index, 1);
          });
     }

     /* BOOKSHELF HANDLERS */
     function createBookshelfHandler(b) {
          _.remove(data.wishlist.all, e => e.book._id === b.book._id);
          data.bookshelf.all.push(b);
     }

     /* REQUEST HANDLERS */
     function handleApprovedRequests(req) {
          const index = _.findIndex(data.requests.incoming.pending.all, {_id: req._id});
          req.seen.user = undefined;
          data.requests.incoming.pending.all.splice(index, 1);
          data.requests.incoming.waiting.all.push(req);
          _.remove(data.requests.incoming.pending.unseen, {_id: req._id});//if approving from messages
          data.requests.incoming.waiting.unseen.push(req);
     }
     function handleDeclinedRequests(req) {
          const reqIndex = _.findIndex(data.requests.incoming.pending.all, {_id: req._id});
          const bookIndex = _.findIndex(data.books.activeAndRequested, {_id: req.book._id});
          data.requests.incoming.pending.all.splice(reqIndex, 1);
          data.books.activeAndRequested[bookIndex].status = 'active';
          data.books.active.push(req.book);
     }
     function handleDeliveredRequests(req) {
          _.remove(data.requests.incoming.waiting.all, {book: req.book});
          _.remove(data.requests.incoming.pending.all, {book: req.book});
          _.remove(data.requests.incoming.waiting.unseen, {_id: req._id});//if approving from messages
          req.seen.user = undefined;
          data.requests.incoming.delivered.all.push(req);
          data.requests.incoming.delivered.unseen.push(req);
          _.remove(data.books.activeAndRequested, {_id: req.book._id});
     }
     function handleCanceledRequests(req) {
          _.remove(data.requests.sent.pending.all, {_id: req._id});
     }
     function createRequestHandler(req) {
          data.requests.sent.all.push(req);
          data.requests.sent.pending.all.push(req);
          data.requests.sent.pending.unseen.push(req);
     }
}
