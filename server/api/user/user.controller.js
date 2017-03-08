'use strict';

import User from './user.model';
import Book from '../book/book.model';
import Request from '../request/request.model';
import WishList from '../wishlist/wishlist.model';
import Bookshelf from '../bookshelf/bookshelf.model';
import jwt from 'jsonwebtoken';
import * as userService from './user.service';
import moment from 'moment';

export async function index(req, res) {
     const users = await User.find({}, '-salt -password -__v').lean();
     res.status(200).json(users);
}

export async function getUserRequests(req, res) {
     const query = {$or: [{owner: req.user._id}, {user: req.user._id}], status: {$in: ['pending', 'waiting', 'delivered']}};
     const requests = await Request.find(query)
          .populate('book').populate({path: 'user', select: 'firstName lastName imageUrl'})
          .populate({path: 'owner', select: 'firstName lastName imageUrl'})
          .sort('-updatedAt').lean();
     res.status(200).json(requests);
}

export async function getUserIncomingRequests(req, res) {
     const query = {owner: req.user._id, status: {$in: ['pending', 'waiting', 'delivered']}};
     if (req.query.bookId) {
          query.book = req.query.bookId;
     }
     const requests = await Request.find(query).populate('book').populate({path: 'user', select: 'firstName lastName'}).lean();
     res.status(200).json(requests);
}

export async function getUserIncomingRequestsAggregation(req, res) {
     const result = await makeRequestAggregation(req, {owner: req.user._id});
     res.status(200).json(result);
}

export async function getUserSentRequestsAggregation(req, res) {
     const result = await makeRequestAggregation(req, {user: req.user._id});
     res.status(200).json(result);
}

export async function getUserSentRequests(req, res) {
     const query = {user: req.user._id};
     if (req.query.bookId) {
          query.book = req.query.bookId;
          query.status = {$in: ['pending', 'declined', 'waiting']};
     }
     const requests = await Request.find(query).populate('book').populate({path: 'user', select: 'firstName lastName'}).populate({path: 'owner', select: 'firstName lastName'}).lean();
     res.status(200).json(requests);
}

export async function getUserWishList(req, res) {
     const query = {user: req.params.id, active: true};
     if (req.query.bookId) {
          query.book = req.query.bookId;
     }
     const wishList = await WishList.find(query).populate({path: 'book', populate: {path: 'user', select: 'firstName lastName imageUrl', model: 'User'}}).lean();
     res.status(200).json(wishList);
}

export async function getUserBookshelf(req, res) {
     const query = {user: req.params.id, active: true};
     const bookshelf = await Bookshelf.find(query).populate('book').lean();
     res.status(200).json(bookshelf);
}

export async function getUserBookshelfAggregation(req, res) {
     const year = req.query.year;
     const query = {
          user: req.user._id,
          createdAt: {$gte: new Date(moment(new Date(year)).startOf('year')), $lte: new Date(moment(new Date(year)).endOf('year'))}
     };
     const data = await Bookshelf.aggregate([
          {$match: query},
          {$group: {_id: {date: {$dateToString: {format: '%m', date: '$createdAt'}}}, count: {$sum: 1}}},
          {$project: {month: '$_id.date', _id: 0, count: 1}}
     ]);
     const result = _.reduce(data, (agg, el) => {
          const month = +el.month - 1;
          agg[month] += el.count;
          return agg;
     }, _.fill(new Array(12), 0));
     res.status(200).json(result);
}

export async function getUserBooks(req, res) {
     const books = await Book.find({user: req.params.id}).lean();
     res.status(200).json(books);
}

export async function create(req, res) {
     req.body.provider = 'local';
     if (req.body.role === 'admin') throw {code: 403, message: 'admin cannot be created'};
     const user = await new User(req.body).save();
     const token = jwt.sign({_id: user._id}, process.env.SESSION_SECRET, { expiresIn: 60 * 60 * 5});
     res.status(201).json({token});
}

export async function show(req, res) {
     const select = 'firstName lastName numeric imageUrl address';
     const user = await User.findById(req.params.id, '-salt -password -verifications -notifications -role')
          .populate([{path: 'following', select}, {path: 'followers', select}]).lean();
     if (!user) throw {code: 404, message: 'User not found'};
     res.status(200).json(user);
}

export async function destroy(req, res) {
     await User.findByIdAndRemove(req.params.id);
     res.status(204).end();
}

export async function changePassword(req, res) {
     const userId = req.user._id;
     const oldPass = String(req.body.oldPassword);
     const newPass = String(req.body.newPassword);
     const user = await User.findById(userId);
     if (!user.authenticate(oldPass)) throw {code: 403, message: 'Invalid password'};
     user.password = newPass;
     await user.save();
     res.status(204).end();
}

export async function updateCurrentUser(req, res) {
     const updatableFields = ['firstName', 'lastName', 'gender', 'about', 'email', 'phone', 'address', 'delivery', 'birthday'];
     const updateObject = _.pick(req.body, updatableFields);
     const user = await User.findById(req.body._id);
     if (!user) throw {code: 404, message: 'User not found'};
     _.extend(user, updateObject);
     await user.save();
     res.status(200).end();
}

export async function updateNotification(req, res) {
     Reflect.deleteProperty(req.body, '_id');
     _.extend(req.user.notifications, req.body);
     await req.user.save();
     res.status(200).end();
}

export async function toggleFollowing(req, res) {
     const index = _.indexOf(_.map(req.user.following, String), req.body.userId.toString());
     const user = await User.findById(req.body.userId);
     if (index === -1) {
          req.user.following.push(req.body.userId);
          user.followers.push(req.user._id);
     } else {
          req.user.following.splice(index, 1);
          user.followers.splice(_.indexOf(_.map(user.followers, String), req.user._id.toString()), 1);
     }
     req.user.numeric.following = req.user.following.length;
     user.numeric.followers = user.followers.length;
     await req.user.save();
     await user.save();
     await User.populate(req.user, {path: 'following', select: 'firstName lastName numeric imageUrl address'});
     res.status(200).json(req.user.following);
}

export async function uploadProfileImage(req, res) {
     req.user.imageUrl = await userService.uploadProfileImage(req.file.path, req.user);
     await req.user.save();
     res.status(200).send(req.user.imageUrl);
}

export async function sendResetEmail(req, res) {
     const user = await User.findOne({email: req.body.email}).lean();
     if (!user) throw {code: 404, message: 'Specified email address is not registered'};
     if (!user.verifications.email) throw {code: 400, message: `Hi ${user.firstName}, looks like your email address is not verified.`};
     await userService.sendResetEmail(user);
     res.status(200).json({message: `Hi ${user.firstName}, email with reset instructions for you account is successfully sent.`});
}

export async function resetPasswordWithToken(req, res) {
     const user = await User.findById({_id: req.body._id});
     if (!user) throw {code: 404, message: 'User not found'};
     user.password = req.body.password;
     await user.save();
     res.status(204).end();
}

export async function setPassword(req, res) {
     req.user.password = req.body.password;
     await req.user.save();
     res.status(204).end();
}

export async function me(req, res) {
     const population = [
          {path: 'followers', select: 'firstName lastName numeric imageUrl address'},
          {path: 'following', select: 'firstName lastName numeric imageUrl address'}
     ];
     const user = await User.findOne({_id: req.user._id}, '-salt -__v').populate(population).lean();
     if (!user) throw {code: 401, message: 'Not authenticated'};
     user.password = !!user.password;
     res.status(200).json(user);
}

async function makeRequestAggregation(req, obj) {
     const statuses = _.castArray(req.query.statuses);
     const year = req.query.year;
     if (_.isEmpty(statuses) || !year) throw {code: 400, message: 'Bad request'};
     const query = _.extend({
          updatedAt: {$gte: new Date(moment(new Date(year)).startOf('year')), $lte: new Date(moment(new Date(year)).endOf('year'))},
          status: {$in: statuses}
     }, obj);
     const data = await Request.aggregate([
          {$match: query},
          {$group: {_id: {date: {$dateToString: {format: '%m', date: '$updatedAt'}}}, count: {$sum: 1}}},
          {$project: {month: '$_id.date', _id: 0, count: 1}}
     ]);
     return _.reduce(data, (agg, el) => {
          const month = +el.month - 1;
          agg[month] += el.count;
          return agg;
     }, _.fill(new Array(12), 0));
}