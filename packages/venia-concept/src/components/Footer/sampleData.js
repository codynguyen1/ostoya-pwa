const accountLinks = new Map()
    .set('Account', null)
    .set('Sign In', null)
    .set('Register', null)
    .set('Order Status', null)
    .set('Returns', null);

const aboutLinks = new Map()
    .set('About Us', null)
    .set('Email Signup', null)

const helpLinks = new Map()
    .set('Help', 'https://facebook.com')
    .set('Contact Us', "https://facebook.com")
    .set('Returns', null);

export const DEFAULT_LINKS = new Map()
    .set('account', accountLinks)
    .set('about', aboutLinks)
    .set('help', helpLinks);

export const LOREM_IPSUM =
    'Welcome to garden haven';
