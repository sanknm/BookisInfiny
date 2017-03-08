'use strict';

import convert from 'xls-to-json';

const xlsToJson = (input, output = null, sheet = 'Sheet1') => {
     return new Promise((resolve, reject) => {
          convert({input, output, sheet}, (err, json) => {
               if (err) return reject('Something went wrong');
               return resolve(json);
          });
     });
};

export {
     xlsToJson
}