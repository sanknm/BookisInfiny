import Book from '../../../api/book/book.model';
import ReqMessage from '../../../api/request/message/req.messages.model';

export default async function (req) {
     console.log('canceled handler');
     Book.updateOne({_id: req.book}, {status: 'active'}).exec();
     new ReqMessage({user: req.user, request: req._id, message: `Book request was canceled by user`, type: 'notification'}).save();
};
