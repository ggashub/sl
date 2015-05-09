/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    preference: {
      model: 'Preferences'
    },
    email:  {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true
    },
    profile: {
      type: 'json',
      required: false
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.updatedAt;
      delete obj.createdAt;
      return obj;
    }
  },

  login: function(req, res) {
    this.findOne({email: req.body.email}, function (err, user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (match) {
            // password match
            req.session.user = user;
            return res.json(user);
          } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            return res.unauthorized({errors:['Invalid email or password']});
          }
        });
      } else {
        return res.unauthorized({errors:['Invalid email or password']});
      }
    });
  },

  beforeCreate: function (values, cb) {
    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};

