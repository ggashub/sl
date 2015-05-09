var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findOneById(id).exec(function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Users.findOne({ email: email}).exec(function(err, user) {
      if (err)
        return done(null, err);
      if (!user) {
        return done(null, false, { message: 'Unknown user ' + email });
      }
      bcrypt.compare(password, user.password, function (err, res) {
        if (!res)
          return done(null, false, {
            message: 'Invalid Password'
          });
        var returnUser = {
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });
      });
    });
  }
));