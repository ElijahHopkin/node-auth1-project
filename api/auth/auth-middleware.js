const Users = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
exports.restricted = function restricted(req, res, next) {
  if(req.session.user != null) {
    next();
  }else{
    res.status(401).json({message: 'You shall not pass!'})
    return
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
exports.checkUsernameFree = async function checkUsernameFree  (req, res, next) {
  try {
    let {username} = req.body
    let alreadyExists = await Users.findBy({username}).first() !=null

    if(alreadyExists) {
      next({status: 422, message:'Username taken'})
    }next()
  } catch (error) {
    next(error)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
exports.checkUsernameExists = async function checkUsernameExists(req, res, next) {
  try {
    let{username} = req.body
    let check = await Users.findBy({username}).first()

    if (check) {
      req.user=check
      next();
    }else{
      next({status: 401, message: 'Invalid Credentials'})
    }
      
    } catch (error) {
    next(error)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
exports.checkPasswordLength = async function checkPasswordLength(req, res, next) {
  try {
    let {password} = req.body
    if(password==null || password.length <4 ) {
      next({status: 422, message: 'Password must be longer than 3 chars'})
    }next()
  } catch (error) {
    next(error)
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
