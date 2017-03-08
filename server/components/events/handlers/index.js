import bookRequested from './book-requested';
import bookApproved from './book-approved';
import bookDelivered from './book-delivered';
import bookExpired from './book-expired';
import bookDeclined from './book-declined';
import bookCanceled from './book-canceled';

const {events} = config;

export default {
     [events.BOOK_REQUESTED]: bookRequested,
     [events.BOOK_APPROVED]: bookApproved,
     [events.BOOK_DELIVERED]: bookDelivered,
     [events.BOOK_EXPIRED]: bookExpired,
     [events.BOOK_DECLINED]: bookDeclined,
     [events.BOOK_CANCELED]: bookCanceled
};
