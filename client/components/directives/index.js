'use strict';

import angular from 'angular';
import {mongoose} from './mongoose-error';
import {allowedChars} from './allowed-chars';
import {scrollGlue} from './scroll-glue';

export default angular.module('bookisApp.directives', [])
     .directive('mongooseError', mongoose)
     .directive('allowedChars', allowedChars)
     .directive('scrollGlue', scrollGlue)
     .name;
