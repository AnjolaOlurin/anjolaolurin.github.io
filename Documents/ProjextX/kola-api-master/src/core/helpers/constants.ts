/*
 * @license
 * Copyright (c) 2018. The Wevied Company.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export const DUPLICATE_UNIQUE_CONSTRAINT_CODE = '23505';
export const COLUMN_NULL_VALUE = 'NULL_VALUE';

export const EmailSubjects = {
    WAIT_LIST: 'Thanks for geting on the wait list',
    ADMIN_WAIT_LIST: 'Some on just joined the Wait List',
    USER_WELCOME: 'Welcome to Kolacredit – Your financial growth begins here',
    CONFIRM_ACCOUNT: 'Confirm Your Email',
    RESET_PASSWORD: 'Reset your Password',
    DISPUTE_REPORT: 'Credit Report Dispute',
};


export const EmailTemplates = {
    WAIT_LIST: 'wait-list',
    ADMIN_WAIT_LIST: 'admin-wait-list',
    SIGNIN_ACCOUNT: 'signin-account',
    USER_WELCOME: 'user-welcome',
    CONFIRM_ACCOUNT: 'confirm-account',
    RESET_PASSWORD: 'reset-password',
    ACTIVATE_ACCOUNT: 'activate-account',
    DISPUTE_REPORT: 'crc-dispute',
};

export const EmailSenders = {
    NO_REPLY: {email: 'support@kolacredit.com', name: 'KolaCredit'},
    HELLO: {email: 'hello@kolacredit.com', name: 'KolaCredit'},
    CRC_DISPUTE: {email: 'support@kolacredit.com', name: 'KolaCredit Dispute'},
};


export const SMSSenders = {
    KOLA_CREDIT: 'N-Alert'
};



export const SMSTemplates = {
    CONFIRM_PHONE: 'confirm-phone',
};


export const AppMessages = {
    TOKEN_INVALIDATED: 'Token Invalidated',
    ACCOUNT_ACTIVATED: 'Account has been activated',
    EMAIL_CONFIRMED: 'Email has been confirmed',
    PHONE_CONFIRMED: 'Phone has been confirmed',
    BVN_CONFIRMED: 'BVN has been confirmed',
    CONFIRMATION_EMAIL_SENT: 'Confirmation email has been sent',
    CONFIRMATION_TEXT_SENT: 'Confirmation text has been sent',
    PASSWORD_RESET_EMAIL_SENT: 'A pin reset email has been sent',
    PASSWORD_RESET_SUCCESSFUL: 'Your pin has been successfull changed',
}
