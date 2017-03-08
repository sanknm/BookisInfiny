'use strict';
import emailService from '../../components/email';
import * as auth from '../../auth/auth.service';
import {uploadImage, genS3Path} from '../../components/s3';
import path from 'path';

export function sendVerifyEmail({_id, email, role, firstName}) {
     const token = auth.signToken(_id, role, 60 * 15);
     const confirmUrl = `${config.domain}/verify-email/${token}`;
     return emailService.sendTemplate('email-confirmation', email, {
          userFirstName: _.capitalize(firstName) || 'Hi there',
          confirmUrl
     });
}

export async function sendVerifyEmailAfterSignup(user) {
     if (this._isNew) {
          sendVerifyEmail(user);
     }
}

export async function sendResetEmail({_id, role, email, firstName}) {
     const token = auth.signToken(_id, role, 60 * 15);
     const resetPasswordUrl = `${config.domain}/reset-password/${token}`;
     return emailService.sendTemplate('reset-password', email, {
          userFirstName: _.capitalize(firstName) || 'Hi there',
          resetPasswordUrl
     });
}

export function uploadProfileImage(localPath, {role, _id}) {
     const imagePath = path.join(__dirname, '/../../..', localPath);
     const s3Path = genS3Path(role, _id, `profile-image${+new Date()}`);
     return uploadImage(imagePath, s3Path);
}

export async function attachNewState(next) {
     this._isNew = this.isNew;
     next();
}
