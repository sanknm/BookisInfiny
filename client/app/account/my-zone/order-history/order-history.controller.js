'use strict';
// @flow

export default class OrderHistoryController {
     Modal;
     userService;
     currentYear;
     /*@ngInject*/
     constructor(chart, moment, userService, Modal) {
          _.extend(this, chart.orderHistoryChart());
          this.Modal = Modal;
          this.userService = userService;
          this.currentYear = moment().year();
          userService.getRequestsAggregation('sent', undefined, this.currentYear, ['pending', 'waiting', 'delivered'])
               .then((data) => {
                    this.data = data;
               });
          this.requests = {
               pending: userService.fetchRequests('sent', 'pending', 'all'),
               waiting: userService.fetchRequests('sent', 'waiting', 'all'),
               completed: userService.fetchRequests('sent', 'delivered', 'all')
          };
          userService.markAsSeen('sent', ['pending', 'waiting', 'delivered'], 'owner');
     }

     cancelRequest(request) {
          this.Modal.confirm('Cancel', request.book.title)
               .then(() => this.userService.cancelRequest(request));
     }
     
     refreshChart(op) {
          op === '+' ? this.currentYear++ : this.currentYear--;
          this.userService.getRequestsAggregation('sent', undefined, this.currentYear, ['pending', 'waiting', 'delivered']);
     }
     
}
