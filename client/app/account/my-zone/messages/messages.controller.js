'use strict';
// @flow

export default class MessagesController {
     messages;
     requestService;
     me;
     message;
     currentRequest;
     Modal;
     userService;
     notification;
     /*@ngInject*/
     constructor(userService, requestService, me, $stateParams, Modal) {
          this.requestService = requestService;
          this.userService = userService;
          this.Modal = Modal;
          this.me = me;
          this.requests = userService.fetchRequests('both', 'withMessages', 'all');
          const index = _.findIndex(this.requests, {_id: $stateParams.id});
          this.currentRequest = this.requests[index > 0 ? index : 0];
          if (this.currentRequest) requestService.getRequestMessages(this.currentRequest).then(conv => {
               this.conversation = conv;
          });
          _.each(this.requests, e => {
               e.updatedAt = new Date(e.updatedAt); // required for orderBy date
          });
          this.notification = message => ({
               user: this.me,
               request: this.currentRequest._id,
               createdAt: new Date(),
               type: 'notification',
               message
          });
     }

     getConversation(req) {
          if (this.currentRequest._id === req._id) return;
          this.requestService.getRequestMessages(req).then(conv => {
               this.currentRequest = this.requests[_.findIndex(this.requests, {_id: req._id})];
               this.conversation = conv;
          })
     }

     sendRequestMessage() {
          this.requestService.createMessage(this.currentRequest, this.message)
               .then(message => {
                    this.conversation.push(_.extend(message, {user: this.me}));
                    this.currentRequest.updatedAt = new Date();
                    this.currentRequest.message = this.message;
                    this.message = '';
               })
     }
     
     accept() {
          this.Modal.confirm('Approve', this.currentRequest.book.title)
               .then(() => this.userService.approveRequest(this.currentRequest))
               .then(() => {
                    this.conversation.push(this.notification(`${this.me.firstName} ${this.me.lastName} accepted book request`));
                    this.currentRequest.updatedAt = new Date();
                    this.currentRequest.status = 'waiting';
                    this.currentRequest.message = `${this.me.firstName} ${this.me.lastName} accepted book request`;
               })
               .catch(err => console.log('err', err));
     }

     deliver() {
          this.Modal.confirm('Mark as delivered', this.currentRequest.book.title)
               .then(() => this.userService.deliverRequest(this.currentRequest))
               .then(() => {
                    this.conversation.push(this.notification(`${this.me.firstName} ${this.me.lastName} marked book as delivered`));
                    this.currentRequest.updatedAt = new Date();
                    this.currentRequest.status = 'delivered';
                    this.currentRequest.message = `${this.me.firstName} ${this.me.lastName} marked book as delivered`;
               })
               .catch(err => console.log('err', err));
     }

};
