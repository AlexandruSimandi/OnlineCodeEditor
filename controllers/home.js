/**
 * Created by rober on 12/03/2016.
 */
var moniker = require('moniker');
var editorRoom = require('../models/editorRoom');

module.exports = {
  index: function(req, res){



      res.sendFile(global.projectDir + "/index.html");
      console.log(req.params.room);

  },
    startRoom: function(req, res){

        var newRoomName = moniker.choose();
        res.redirect('/' + newRoomName);

    }
};