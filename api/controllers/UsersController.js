/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {
  login: function(req, res) {
    return Users.login(req, res);
  },
  getAuthUser: function(req, res) {
    return res.json([req.session.user]);
  },
  uploadAvatar: function (req, res) {

    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    },function whenDone(err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      // Save the "fd" and the url where the avatar for a user can be accessed
      Users.findOne({id: req.session.user.id}, function(err, user) {
        if (err) return res.negotiate(err);
        // Generate a unique URL where the avatar can be downloaded.
        user.profile.avatarUrl = require('util').format('/users/avatars/%s', req.session.user.id);
        user.profile.avatarThumbUrl = require('util').format('/users/avatars/%s?type=thumb', req.session.user.id);
        // Grab the first file and use it's `fd` (file descriptor)
        user.profile.avatarFd = uploadedFiles[0].fd;
        user.profile.avatarThumbFd = uploadedFiles[1].fd;

        user.save();
        return res.json(user);
      });
    });
  },
  downloadAvatar: function (req, res){
    req.validate({
      id: 'string'
    });

    Users.findOne(req.param('id')).exec(function (err, user){
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // User has no avatar image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!user.profile.avatarFd) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk(/* optional opts */);

      // Stream the file down
      if (req.param('type') == 'thumb') {
        var fd = user.profile.avatarThumbFd;
      } else {
        var fd = user.profile.avatarFd;
      }
      fileAdapter.read(fd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
    });
  }
};