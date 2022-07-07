import { UserModel } from '../models/User';
const LocalStrategy = require('passport-local').Strategy;
var JwtCookieComboStrategy = require('passport-jwt-cookiecombo');
const bcrypt = require("bcryptjs");


module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        session: false
    }, (email, password, done) => {
        UserModel.findOne({ email }).then(user => {
            // Check if user exists
            if (!user) {
                return done(null, false);
            }

            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }));
    
    passport.use(new JwtCookieComboStrategy({
        secretOrPublicKey: process.env.JWT_SECRET,
        jwtCookieName: 'jwt',
        passReqToCallback: false
    }, (payload, done) => {
        return done(null, payload);
    }));
}