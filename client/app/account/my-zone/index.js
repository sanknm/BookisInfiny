'use strict';

import angular from 'angular';
import MyZoneController from './my-zone.controller';
import settings from './settings';
import orderHistory from './order-history';
import dashboardNotifications from './dashboard-notifications';
import messages from './messages';
import people from './people';
import salesBooth from './sales-booth';
import wishList from './wishlist';
import bookShelf from './bookshelf';
import salesHistory from './sales-history';
import routing from './my-zone.routes';

export default angular.module('bookisApp.myZone', [settings, orderHistory, dashboardNotifications, messages, people, salesBooth,
     wishList, bookShelf, salesHistory])
     .config(routing)
     .controller('MyZoneController', MyZoneController)
     .name;
