const express = require('express');
const router = express.Router();
const {pool, generate} = require('../../utils.js')
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

router.get('/oauth/uri', async (req, res) => {
    console.log(req.query.code)

    const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: req.query.code,
    });
    var stripe_secret_key = response.access_token
    var stripe_publishable_key = response.stripe_publishable_key
    var stripe_user_id = response.stripe_user_id
    // {
    //    access_token: 'sk_test_51FyPghKy6nlVx7jg0myyKebgsDDlzzb4u0dGzcUYBHsTQQB3NR7Vlg2xsJyn7CekAnlD3UiS3a6nCgbhXQsfqEeB00R2Q9Vf6o',
    //    livemode: false,
    //    refresh_token: 'rt_Iovkxypwmirf4oWRDzt2jl4I0rYl4E5AJQHAPjanFsMPUpNT',
    //    token_type: 'bearer',
    //    stripe_publishable_key: 'pk_test_51FyPghKy6nlVx7jg0e0atKX2v3vRBhwNsi9eyXqhiellMYDDBxRGmmIxr68KgE0RkozLTcegpHiHGtvVxCQLzTcN00OI5mYR5F',
    //    stripe_user_id: 'acct_1FyPghKy6nlVx7jg',
    //    scope: 'read_write'
    // }
      
})

let redirect = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID_STRIPE}&scope=read_write&redirect_uri=${process.env.REDIRECT_URI_STRIPE}`
console.log(redirect)
module.exports = router