import emailService from '../../email';
import Request from '../../../api/request/request.model';
import Book from '../../../api/book/book.model';
import moment from 'moment';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Wishlist from '../../../api/wishlist/wishlist.model';
import Bookshelf from '../../../api/bookshelf/bookshelf.model';

export default async function (req) {
     console.log('delivered handler');
     await Promise.all([
          /* Invalidate all other request on book with state waiting or pending */
          Request.updateMany({book: req.book, status: {$in: ['waiting', 'pending']}, owner: req.owner}, {status: 'declined'}),
          /* Mark book as sold and change owner */
          Book.updateOne({_id: req.book}, {status: 'sold', user: req.user}),
          /* Populate fields required for email template */
          Request.populate(req, [
               {path: 'book', select: 'title'},
               {path: 'user', select: 'firstName email'},
               {path: 'owner', select: 'firstName lastName'}
          ])
     ]);
     emailService.sendTemplate('book-deliver', req.user.email, {
          user: req.user.firstName,
          owner: `${req.owner.firstName} ${req.owner.lastName}`,
          endDate: moment().add(2, 'days').format('MM/DD/YYYY'),
          title: req.book.title
     });
     new ReqMessage({user: req.owner._id, request: req._id, message: `${req.owner.firstName} ${req.owner.lastName} marked book as delivered`, type: 'notification'}).save();
     //Remove from wishlist
     Wishlist.update({active: true, book: req.book._id, user: req.user._id}, {active: false}).exec();
     //Add to bookshelf
     Bookshelf.findOneAndUpdate({active: true, book: req.book._id, user: req.user._id}, {book: req.book._id, user: req.user._id}, {upsert: true, setDefaultsOnInsert: true}).exec();
};
