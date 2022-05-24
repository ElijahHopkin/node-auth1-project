const db= require('../../data/db-config')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
exports.find= function find() {
  return db('users');
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
exports.findBy= function findBy(filter) {
  return db('users').where(filter);
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
exports.findById= function findById(user_id) {
  return db('users')
  .select('user_id', 'username')
  .where({user_id})
  .first();
}

/**
  resolves to the newly inserted user { user_id, username }
 */
exports.add= async function add(user) {
  const [id] = await db('users').insert(user);

  return this.findById(id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules

