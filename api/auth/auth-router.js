const express = require('express')
const bcrypt = require('bcryptjs');
const {checkPasswordLength,  checkUsernameExists, checkUsernameFree} = require ('./auth-middleware');
const Users = require('../users/users-model')

const router = express.Router();

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


router.post('/register', checkUsernameFree,checkPasswordLength, async (req, res, next) => {
  try {
    const {username, password} = req.body
    let hash = bcrypt.hashSync(password, 10);
    let result = await Users.add({username, password:hash})

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


  router.post('/login', checkUsernameExists, (req, res, next) => {
    try {
      let { password} = req.body;

    if(bcrypt.compareSync(password, req.user.password)){
      req.session.user=req.user
      res.status(200).json({message:`Welcome ${req.user.username}`})
    }else{
     res.status(401).json({message:`Invalid credentials`}) 
    }
    }
    catch (error) {
      next(error)
    }
  })
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


  router.get('/logout', (req, res, next) => {
    if(req.session.user){
      req.session.destroy( error => {
        if(error) {
          next(error)
        }else{
          res.status(200).json({message:'logged out'})
        }
      })
    }else{
      res.status(400).json({message: 'no session'})
    }
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules


module.exports= router