'use strict';
// @flow

export default class PopularController {
     books;
     genres;
     requestService;
     Auth;
     me;
     breakpoints = [
          {
               breakpoint: 1200,
               settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
               }
          },
          {
               breakpoint: 1000,
               settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
               }
          },
          {
               breakpoint: 800,
               settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
               }
          },
          {
               breakpoint: 600,
               settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
               }
          }
     ];
     slickConfig = {
          infinite: true,
          draggable: true,
          slidesToShow: 5,
          slidesToScroll: 5,
          initialSlide: 0,
          event: {
               // breakpoint(e, c, b) {
               // },
               // afterChange(event, slick, currentSlide, nextSlide) {
               // },
               // edge(event, slick, direction) {
               // },
               // init(event, slick) {
               // }
          }
     };
     /*@ngInject*/
     constructor($http, bookService, requestService, Auth) {
          this.requestService = requestService;
          this.Auth = Auth;
          this.me = this.Auth.getCurrentUserSync();//eslint-disable-line no-sync
          bookService.getBooks()
               .then(books => {
                    this.books = books;
               });
          $http({url: 'api/genres', method: 'GET'}).then(xhr => {
               this.genres = xhr.data;
          });
     }
}
