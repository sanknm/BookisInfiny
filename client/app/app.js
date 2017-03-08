'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
import ngValidationMatch from 'angular-validation-match';
import ngMaterial from 'angular-material';
import 'moment';
import 'angular-moment';
import 'ng-file-upload';
import 'angular-simple-logger';
import 'angular-google-maps';
require('imports?this=>window,exports=>false,define=>false!ui-cropper');
import 'angular-socialshare';
import 'slick-carousel';
import 'angular-chart.js';
import 'angular-elastic';

import {
     routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import home from './home';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import navbarSub from '../components/navbar-sub/navbar-sub.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import toast from '../components/toast';
import googleAutocomplete from '../components/address-autocomplete';
import Modal from '../components/modal/modal.service';
import directives from '../components/directives';
import bp from '../components/book-panel.component/book-panel.component';
import user from '../components/resources-services/user';
import book from '../components/resources-services/book';
import request from '../components/resources-services/request';
import bookRating from '../components/resources-services/book-ratings';
import select from '../components/bookis-select/bookis-select.component';
import birthday from '../components/bookis-birthday/bookis-birthday.component';
import slick from '../components/bookis-slick';
import rating from '../components/bookis-rating/bookis-rating.component';
import bookisChart from '../components/bookis-chart/bookis-chart.component';
import bookReview from '../components/resources-services/book-reviews';
import bookReply from '../components/resources-services/book-replies';
import wishlist from '../components/resources-services/wishlist';
import bookshelf from '../components/resources-services/bookshelf';
import userProfile from '../components/bookis-user-profile/bookis-user-profile.component';
import chart from '../components/chart';
import templates from '../components/templates';
import '../components/chart/border.radius';
import './app.scss';
import '../touch';

angular.module('bookisApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth, home, user, 'uiCropper', 'ngFileUpload', 'nemLogging', 'uiGmapgoogle-maps',
     account, admin, navbar, footer, main, constants, util, Modal, directives, bp, ngValidationMatch, ngMaterial, book, toast, googleAutocomplete, select, birthday, request,
     'angularMoment', navbarSub, slick, rating, bookRating, 'chart.js', chart, bookReview, bookReply, '720kb.socialshare', templates, wishlist, bookisChart, bookshelf,
     'monospaced.elastic', userProfile])
     .config(routeConfig)
     .config((uiGmapGoogleMapApiProvider, $mdThemingProvider) => {
          'ngInject';
          uiGmapGoogleMapApiProvider.configure({
               key: 'AIzaSyA-B0gD8c5MYPxyT3ElHwnGxMPvhpRwnNc',
               v: '3.25',
               libraries: 'weather,geometry,places,visualization'
          });
          $mdThemingProvider.theme('default')
               .primaryPalette('deep-orange', {});
     })
     // .constant('moment', require('moment-timezone'))
     .run(($rootScope, $location, Auth) => {
          'ngInject';
          // Redirect to login if route requires auth and you're not logged in

          $rootScope.$on('$stateChangeStart', (event, next) => {
               Auth.isLoggedIn(loggedIn => {
                    if (next.authenticate && !loggedIn) {
                         $location.path('/login');
                    }
               });
          });
     });

angular.element(document)
     .ready(() => {
          angular.bootstrap(document, ['bookisApp'], {
               strictDi: true
          });
     });
