/* eslint-disable no-console */
const crypto = require('crypto');

const User = require('../db/models/User.js');

function hash(text) {
  return crypto.createHash('sha1')
    .update(text).digest('base64');
}

// Handle user create on POST
exports.user_create_post = (req, res) => {
  const createUser = (userData) => {
    const user = {
      position: userData.position,
      name: userData.name,
      email: userData.email,
      password: hash(userData.password),
      phone: userData.phone,
      organization: userData.organization,
      task: userData.task,
      country: userData.country,
    };
    return new User(user).save();
  };
  createUser(req.body)
    .then(() => {
      console.log('User created');
      res.send('success');
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        res.status(500).send('User with this email has already been created');
      } else res.status(501).end();
    });
};
