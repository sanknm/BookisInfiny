'use strict';

export function BookService(BookAPI, toast, Util, Upload) {
     'ngInject';
     let books = [];
     return {
          getBooks,
          getBook,
          createBook,
          bulkBookImport,
          editBook,
          removeBook
     };

     function getBooks() {
          return BookAPI.query().$promise
               .then(b => {
                    Util.bindArray(books, b);
                    return books;
               })
               .catch(err => console.log(err));
     }

     function getBook(id) {
          return BookAPI.get({id}).$promise
               .then(book => book)
               .catch(err => console.log(err));
     }

     function createBook(book, collection = books) {
          const newBook = new BookAPI(book);
          return newBook.$save()
               .then(b => {
                    collection.unshift(b);
                    toast.simple('Book Added for sale!');
                    return b;
               })
               .catch(err => console.log(err));
     }

     function bulkBookImport(file) {
          return Upload.upload({url: 'api/books/bulk', data: {file}})
               .then(res => res.data, err => console.log('err: ', err));
     }

     function editBook(book, collection = books) {
          let index = _.findIndex(collection, {_id: book._id});
          return BookAPI.editBook(book).$promise
               .then(b => {
                    collection[index] = b;
                    toast.simple('Book updated!');
                    return b;
               })
               .catch(err => console.log(err));
     }

     function removeBook(book, collection = books) {
          let index = _.findIndex(collection, {_id: book._id});
          if (!(book instanceof BookAPI)) book = new BookAPI(book);
          return book.$remove()
               .then(r => {
                    if (collection[index]) collection[index].active = false;
                    toast.simple('Book deleted!');
                    return r;
               })
               .catch(err => console.log(err));
     }
}
