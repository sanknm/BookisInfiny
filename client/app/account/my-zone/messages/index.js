'use strict';

import angular from 'angular';
import MessagesController from './messages.controller';

export default angular.module('bookisApp.messages', [])
     .controller('MessagesController', MessagesController)
     .name;
