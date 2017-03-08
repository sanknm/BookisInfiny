import Book from '../../../api/book/book.model';
import ReqMessage from '../../../api/request/message/req.messages.model';

export default async function (req) {
     console.log('declined handler');
     /* Re activate book */
     Book.updateOne({_id: req.book}, {status: 'active'}).exec();
     new ReqMessage({user: req.owner, request: req._id, message: `Book request was declined by owner`, type: 'notification'}).save();
};
