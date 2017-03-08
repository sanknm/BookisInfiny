import emailService from '../../email';
import Request from '../../../api/request/request.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import * as auth from '../../../auth/auth.service';

export default async function (req) {
     console.log('approved handler');
     await Promise.all([
          /* Populate fields required for email template */
          Request.populate(req, [
               {path: 'book', select: 'title author year imageUrl'},
               {path: 'user', select: 'firstName lastName email'},
               {path: 'owner', select: 'firstName lastName email'}
          ])
     ]);
     const token = auth.signToken(req.user._id, req.user.role, 60 * 60 * 24);
     emailService.sendTemplate('book-approve', req.user.email, {
          reviewUrl: `${config.domain}?jwt=${token}&redirect=myzone.orderhistory`,
          user: req.user.firstName,
          title: req.book.title
     });
     new ReqMessage({user: req.owner._id, request: req._id, message: `${req.owner.firstName} ${req.owner.lastName} accepted book request`, type: 'notification'}).save();
};
