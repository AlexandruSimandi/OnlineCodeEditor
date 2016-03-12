/**
 * Created by rober on 12/03/2016.
 */
module.exports = {
  index: function(req, res){
      res.sendFile(global.projectDir + "/index.html")
  }
};