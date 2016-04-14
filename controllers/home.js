/**
 * Created by rober on 12/03/2016.
 */
var moniker = require('moniker');
var editorRoom = require('../models/editorRoom');
var mongoose = require('mongoose');

module.exports = {
  index: function(req, res){
      //favicon.ico

      if(req.params.room !== 'favicon.ico' && req.params.room !== 'socket.io'){
          
          console.log('numele camerei: ' + req.params.room);

          var newRoom = mongoose.model('EditorRoom', editorRoom);

          newRoom.findOne({ '_id': req.params.room}, function(err, room){

              if(err)
                  return handleError(err);

//              console.log("text: " + room.text);

          });

          res.sendFile(global.projectDir + "/index.html");
      }


  },
    startRoom: function(req, res){

        var newRoomName = moniker.choose();
        var room = new editorRoom({
            _id: newRoomName,
            text: ""
        });
        room.save();
        res.redirect('/' + newRoomName);

    }
};
