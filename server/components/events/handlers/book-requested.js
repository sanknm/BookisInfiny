import emailService from '../../email';
import Request from '../../../api/request/request.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Wishlist from '../../../api/wishlist/wishlist.model';
import Book from '../../../api/book/book.model';
import * as auth from '../../../auth/auth.service';

export default async function (req) {
     console.log('requested handler');
     await Promise.all([
          /* Populate fields required for email template */
          Request.populate(req, [
               {path: 'book', select: 'title author year imageUrl price'},
               {path: 'user', select: 'firstName lastName email'},
               {path: 'owner', select: 'firstName lastName email role'}
          ]),
          /* Mark book state as requested */
          Book.updateOne({_id: req.book}, {status: 'requested'})
     ]);
     if (req.message) {
          new ReqMessage({user: req.user._id, request: req._id, message: req.message}).save();
     }
     Wishlist.findOneAndUpdate({active: true, book: req.book._id, user: req.user._id}, {book: req.book._id, user: req.user._id}, {upsert: true, setDefaultsOnInsert: true}).exec();
     const token = auth.signToken(req.owner._id, req.owner.role, 60 * 60 * 24);
     emailService.sendTemplate('book-request', req.owner.email, {
          reviewUrl: `${config.domain}?jwt=${token}&redirect=myzone.salesbooth.pending`,
          owner: req.owner.firstName,
          user: `${req.user.firstName} ${req.user.lastName}`,
          imageUrl: req.book.imageUrl,
          title: req.book.title,
          message: req.message || '',
          price: `${req.book.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} NOK`, // eslint-disable-line space-infix-ops
          author: req.book.author,
          year: req.book.year
     });
};
