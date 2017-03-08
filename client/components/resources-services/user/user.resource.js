'use strict';

export function UserResource($resource) {
     'ngInject';

     return $resource('/api/users/:id/:controller/:type/:sub', {
          id: '@_id'
     }, {
          changePassword: {
               method: 'PUT',
               params: {
                    controller: 'password'
               }
          },
          verifyEmail: {
               method: 'PATCH',
               params: {
                    id: 'verifications',
                    controller: 'email'
               }
          },
          sendResetEmail: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'email'
               }
          },
          resendVerificationEmail: {
               method: 'POST',
               params: {
                    id: 'verifications',
                    controller: 'email'
               }
          },
          resetPasswordWithToken: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'reset'
               }
          },
          setPassword: {
               method: 'POST',
               params: {
                    id: 'password',
                    controller: 'set'
               }
          },
          updateCurrentUser: {
               method: 'PUT'
          },
          updateNotification: {
               method: 'PATCH',
               params: {
                    controller: 'notifications'
               }
          },
          toggleFollow: {
               method: 'PATCH',
               isArray: true,
               params: {
                    controller: 'following'
               }
          },
          get: {
               method: 'GET',
               params: {
                    id: 'me'
               }
          },
          getBooks: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'books'
               }
          },
          getIncomingRequestsAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'incoming',
                    sub: 'aggregation'
               }
          },
          getIncomingRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'incoming'
               }
          },
          getSentRequestsAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'sent',
                    sub: 'aggregation'
               }
          },
          getSentRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests',
                    type: 'sent'
               }
          },
          getRequests: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'requests'
               }
          },
          getWishList: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'wishlist'
               }
          },
          getBookshelf: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'bookshelf'
               }
          },
          getBookShelfAggregation: {
               isArray: true,
               method: 'GET',
               params: {
                    controller: 'bookshelf',
                    type: 'aggregation'
               }
          }
     });
}
