'use strict';

import cron from 'cron';
import Request from '../../api/request/request.model';

const {CronJob} = cron;

function startCronJobs() {
     startCronJob('* */1 * * *', [deactivateExpiredBookRequests]);
}

function startCronJob(period, functions) {
     new CronJob(period, async function () {  // eslint-disable-line
          try {
               for (const func of functions) {
                    await func();
               }
          } catch (err) {
               console.log('Err :', err);
          }}, () => {
               /* This function is executed when the job stops */
          }, true, /* Start the job right now */
     );
}

async function deactivateExpiredBookRequests() {
     try {
          const requests = await Request.find({expire: {$lt: new Date()}, status: 'pending'});
          for (const request of requests) {
               request.status = 'expired';
               request.save();
          }
     } catch (err) {
          console.log('Err :', err);
     }
}

export default {startCronJobs};
export const jobs = {
     deactivateExpiredBookRequests
};
