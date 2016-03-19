/**
 * Created by rober on 19/03/2016.
 */
var editorRoom = require('../../models/editorRoom');
var mongoose = require('mongoose');

module.exports = {
    index: function(req, res){

        var newRoom = mongoose.model('EditorRoom', editorRoom);
        var returnedRoom = {};
        newRoom.findOne({ '_id': req.params.room}, function(err, room){

            if(err)
                return handleError(err);

            console.log("text: " + room.text);
            res.json(room);

        });


    }
};