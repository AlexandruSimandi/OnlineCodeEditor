/**
 * Created by rober on 12/03/2016.
 */
var moniker = require('moniker');
module.exports = {
    index: function(req, res){
        res.send(moniker.choose());
        //JSON.stringify({ generat: moniker.choose() })
    }
};