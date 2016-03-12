/**
 * Created by rober on 12/03/2016.
 */
var moniker = require('moniker');
module.exports = {
    index: function(res, req){
        res.send('ceva');
        //JSON.stringify({ generat: moniker.choose() })
    }
};