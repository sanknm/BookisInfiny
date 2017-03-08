import Book from '../../../api/book/book.model';
import ReqMessage from '../../../api/request/message/req.messages.model';

export default async function (req) {
     console.log('expired handler');
     Book.updateOne({_id: req.book}, {status: 'active'}).exec();
     new ReqMessage({user: req.owner, request: req._id, message: `Request for this book has expired`, type: 'notification'}).save();

};
