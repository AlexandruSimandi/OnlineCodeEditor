/**
 * Created by rober on 12/03/2016.
 */
var moniker = require('moniker');
var mongoose = require('mongoose');
var editorRoom = mongoose.model('EditorRoom').schema; 

module.exports = {
  index: function(req, res){

      if(req.params.room !== 'favicon.ico' && req.params.room !== 'socket.io'){

          console.log('numele camerei: ' + req.params.room);

          var newRoom = mongoose.model('EditorRoom', editorRoom);

          var update = {

            $setOnInsert: {

                _id: req.params.room,
                text: ""

            }

          };

          var options = {
              
            //If the object dosen't exits it will be created
            upsert: true

          };

          newRoom.findOneAndUpdate({ '_id': req.params.room}, update, options, function(err, room){

              if(err)
                  return handleError(err);

//              console.log("text: " + room.text);

          });

          res.sendFile(global.projectDir + "/index.html");
      }


  },
    startRoom: function(req, res){

        var newRoomName = moniker.choose();

        var roomSchema = mongoose.model('EditorRoom', editorRoom);

        var room = new roomSchema({
            _id: newRoomName,
            text: ""
        });
        room.save();
        res.redirect('/codeeditor/' + newRoomName);

    }
};
