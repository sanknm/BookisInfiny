'use strict';

import angular from 'angular';
import CommunityController from './community.controller';
import routing from './community.routes';
import userProfile from './user';

export default angular.module('bookisApp.community', [userProfile])
     .config(routing)
     .controller('CommunityController', CommunityController)
     .name;
