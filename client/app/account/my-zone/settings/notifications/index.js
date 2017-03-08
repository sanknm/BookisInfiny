'use strict';

import angular from 'angular';
import NotificationsController from './notifications.controller';

export default angular.module('bookisApp.notifications', [])
     .controller('NotificationsController', NotificationsController)
     .name;
