/**
 * Created by rober on 11/04/2016.
 */
var editorRoom = require('../models/editorRoom');
var mongoose = require('mongoose');

module.exports = {

    index: function(req, res){


        res.set({'Content-Disposition':"attachment; filename=\"" + req.params.roomName + ".txt\"", 'Content-type': 'text/txt'});
        var EditorRoom = mongoose.model('EditorRoom', editorRoom);
        EditorRoom.findOne({ '_id': req.params.roomName }, 'text', function (err, room) {
            if (err) return handleError(err);
            res.send(room.text);
        });

    }

};