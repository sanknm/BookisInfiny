'use strict';

export function BookResource($resource) {
     'ngInject';

     return $resource('/api/books/:id/:controller', {
          id: '@_id'
     }, {
          editBook: {
               method: 'PUT'
          }
     });
}
