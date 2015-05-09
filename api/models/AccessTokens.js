module.exports = {
  attributes: {
    userId: {
      type: 'string',
      required: true
    },
    clientId: {
      type: 'string',
      required: true
    },
    token: 'string',
    scope: 'string'
  }
};