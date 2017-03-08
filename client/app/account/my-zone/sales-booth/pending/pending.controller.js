'use strict';
// @flow

export default class PendingController {
     Modal;
     requests;
     userService;
     /*@ngInject*/
     constructor(Modal, userService) {
          this.Modal = Modal;
          this.userService = userService;
          this.requests = userService.fetchRequests('incoming', 'pending', 'all');
          userService.markAsSeen('incoming', ['pending'], 'user');
     }

     approveRequest(request) {
          this.Modal.confirm('Approve', request.book.title)
               .then(() => this.userService.approveRequest(request))
               .catch(err => console.log('err', err));
     }

     declineRequest(request) {
          this.Modal.confirm('Decline', request.book.title)
               .then(() => this.userService.declineRequest(request))
               .catch(err => console.log('err', err));
     }
}
