/**
 * ReferencesController
 *
 * @description :: Server-side logic for managing references
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  getList: function(req, res) {
    var criteria = actionUtil.parseCriteria(req);
    if (criteria.startDate) {
      var startDate = new Date(criteria.startDate);
      startDate.setHours(0, 0, 0, 0);
      criteria.createdAt = {'>=': startDate};
      criteria.startDate = null;
    }
    if (criteria.endDate) {
      var endDate = new Date(criteria.endDate);
      endDate.setHours(23, 59, 59, 999);
      criteria.createdAt = {'<=': endDate};
      criteria.endDate = null;
    }
    //console.log(criteria);
    var q = References.find()
      .where(criteria)
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) );
      q = actionUtil.populateEach(q, req);
    q.exec(function(err, users) {
      if (err) return res.serverError(err);
      res.ok(users);
    });
  }
};

