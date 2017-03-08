'use strict';

import moment from 'moment';
import emitter from '../../components/events';
const {events} = config;

export function addExpirationDate(next) {
     this._isNew = this.isNew;
     this.expire = moment(this.createdAt).add(1, 'day');
     next();
}

export async function emit(req) {
     if (req._isNew) {
          emitter.emit(events.BOOK_REQUESTED, req);
     }
     if (req.status === 'waiting') {
          emitter.emit(events.BOOK_APPROVED, req);
     }
     if (req.status === 'delivered') {
          emitter.emit(events.BOOK_DELIVERED, req);
     }
     if (req.status === 'expired') {
          emitter.emit(events.BOOK_EXPIRED, req);
     }
     if (req.status === 'declined') {
          emitter.emit(events.BOOK_DECLINED, req);
     }
     if (req.status === 'canceled') {
          emitter.emit(events.BOOK_CANCELED, req);
     }
}
