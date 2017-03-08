'use strict';

export function chartService() {
     'ngInject';

     return {
          orderHistoryChart
     };

     function orderHistoryChart() {
          return {
               override: {
                    backgroundColor: 'rgba(92,93,105, 1)',
                    hoverBackgroundColor: 'rgba(92,93,105, 0.8)',
                    label: 'Books'
               },
               labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
               options: {
                    scales: {
                         yAxes: [{
                              ticks: {
                                   beginAtZero: true,
                                   userCallback: label => {
                                        if (Math.floor(label) === label) {
                                             return label;
                                        }
                                   }
                              },
                              scaleLabel: {
                                   display: true,
                                   labelString: 'No. of Books'
                              },
                              gridLines: {
                                   display: true,
                                   borderDash: [7]
                              }
                         }],
                         xAxes: [{
                              gridLines: {
                                   display: false
                              }
                         }]
                    }
               }
          };
     }
}
