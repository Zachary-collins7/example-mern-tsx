import express from "express";
const router = express.Router();

import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtOpts from "../../config/jwtOpts";

import { IUser, UserModel } from '../../models/User';

// debug routes
// TODO: REMOVE DEBUG
//get all users
router.all("/users", (req, res) => {
    UserModel.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = user;
        });

        res.send(userMap);
    })
})

//delete all users
router.all("/users/deleteall", (req, res) => {
    UserModel.remove({}, (error) => {
        if (error)
            res.status(500).send(error);
    })
    return "deleted";
})
// TODO: REMOVE DEBUG


// creates two jwt tokens - auth and refresh
// returns { token, refreshToken } if success
// or { error } if error
const createJwtTokens = (user: {id: string, name: string, email: string} | IUser) => {
    // user object with values that can be securely be sent to the user
    // put in the payload of the jwt token
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email
    }
    try {
        const token = jwt.sign(
            safeUser,
            jwtOpts.secret,
            jwtOpts.options
        );
        const refreshToken = jwt.sign(
            safeUser,
            jwtOpts.refresh.secret,
            jwtOpts.refresh.options
        );
        return {
            token,
            refreshToken
        }
    } catch (error) {
        return {
            error
        }
    }
}


/*
 * /api/v1/test - test token api route
 * if valid token in request cookies
 * returns Authenticated and status 200
 */
router.use("/test", passport.authenticate('jwt-cookiecombo', { session: false })); // use auth for this route
router.all("/test", (req, res) => {
    return res.status(200).send("Authenticated")
});

/*
 * /api/v1/refresh - refresh token api route
 * if valid refresh token in request cookies
 * returns new jwt and jwt_refresh tokens with status 200
 * if invalid refresh token returns 401
 */
router.all("/refresh", (req, res) => {
    const oldRefreshToken = req.signedCookies["jwt_refresh"]
    const payload = jwt.verify(oldRefreshToken, jwtOpts.refresh.secret)
    
    if (payload) {
        const safeUser: { id: string, name: string, email: string } = {
            id: payload["id"],
            name: payload["name"],
            email: payload["email"]
        }
        const { token, refreshToken, error } = createJwtTokens(safeUser);

        if (!token || !refreshToken)
            return res.status(500).json(error);


        res.cookie('jwt', token, jwtOpts.cookie);
        res.cookie('jwt_refresh', refreshToken, jwtOpts.refresh.cookie);

        return res.json({
            jwt: token,
            jwt_refresh: refreshToken
        });
    }
    return res.status(401).send("Unauthorized");
})

/* 
 * /api/v1/register - register api route
 * form fields required: email, password, name
 * returns new jwt and jwt_refresh tokens and cookies with status 200 or error with status 400
 */
router.post("/register", (req, res) => {
    const { email, password, name }: {
        email: string, 
        password: string,
        name: string
    } = req.body;

    // Form validation
    if (!email || !password || !name)
        return res.status(400).json({ message: 'Name, email, and passoword are required' })

    UserModel.findOne({ email }).then(user => {
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        } else {
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;

                    const newUser = new UserModel({
                        name,
                        email,
                        password: hash
                    });
                    
                    newUser
                        .save()
                        .then((user) => {
                            const { token, refreshToken, error } = createJwtTokens(user)

                            if (!token || !refreshToken)
                                return res.status(500).json(error);
                                

                            res.cookie('jwt', token, jwtOpts.cookie);
                            res.cookie('jwt_refresh', refreshToken, jwtOpts.refresh.cookie);

                            return res.json({
                                jwt: token,
                                jwt_refresh: refreshToken
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

/* 
 * /api/v1/login - login api route
 * form fields required: email, password
 * returns new jwt and jwt_refresh tokens and cookies with status 200 or error with status 400
 */
router.post('/login', passport.authenticate('local', { session: false}), (req, res) => {
    // Create and sign json web token with the user as payload
    const { email }: { email: string } = req.body;
    
    // Form validation
    if (!email)
        return res.status(400).json({ msg: 'Password, email, and name are required' })

    UserModel.findOne({ email })
        .then(user => {
            const { token, refreshToken, error } = createJwtTokens(user);

            if (!token || !refreshToken)
                return res.status(500).json(error);


            res.cookie('jwt', token, jwtOpts.cookie);
            res.cookie('jwt_refresh', refreshToken, jwtOpts.refresh.cookie);

            return res.json({
                jwt: token,
                jwt_refresh: refreshToken
            });
        })
        .catch(() => res.status(500).json({ message: "No user found" }));
});

module.exports = router;