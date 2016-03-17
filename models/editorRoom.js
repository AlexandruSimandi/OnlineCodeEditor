/**
 * Created by rober on 17/03/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var editorRoomSchema = new Schema(
    {

        _id: String,
        text: String

    },
    {
        _id: false
    });

module.exports = mongoose.model('EditorRoom', editorRoomSchema);