'use strict';
// @flow

export default class PeopleController {
    navigationItems;
    currentNavItem:string;
    /*@ngInject*/
    constructor($state, me) {
         this.navigationItems = [{
              title: 'Followers',
              state: '.followers',
              number: me.following
         }, {
              title: 'Following',
              state: '.following',
              number: me.followers
         }];
         const title = _.capitalize($state.current.url.substring(1).replace(/-/g, ' '));
         this.currentNavItem = _.findIndex(this.navigationItems, {title});
         if (title === 'People') this.currentNavItem = 0;

    }

}