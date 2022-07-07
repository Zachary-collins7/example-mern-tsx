// Put anything that is specific to jwt token creation or jwt cookie creation here

const sharedJwtOptions = {
    // audience: 'https://example.io',
    expiresIn: '1m'
    // issuer: 'example.io'
}
const sharedCookieSettings = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.DEV !== "TRUE",
    maxAge: 1000 * 60 * 60 * 24 * 7 // cookies last for 7d
}
export default {
    secret: process.env.JWT_SECRET,
    options: {
        ...sharedJwtOptions
    },
    cookie: {
        ...sharedCookieSettings
    },
    refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        options: {
            ...sharedJwtOptions,
            expiresIn: '1h'
        },
        cookie: {
            ...sharedCookieSettings
        }
    }
}