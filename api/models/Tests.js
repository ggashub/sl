/**
* Tests.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    //Association
    referenceId: {
      model: 'References'
    },
    QPISlice: {
      type: 'array',
      required: false
    },
    kbps: {
      type: 'array',
      required: false
    },
    Y_psnr: {
      type: 'array',
      required: false
    },
    U_psnr: {
      type: 'array',
      required: false
    },
    V_psnr: {
      type: 'array',
      required: false
    },
    Enc_Ts: {
      type: 'array',
      required: false
    },
    Dev_Ts: {
      type: 'array',
      required: false
    },
    Enc_Th: {
      type: 'array',
      required: false
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.updatedAt;
      delete obj.createdAt;
      return obj;
    }
  }
};
