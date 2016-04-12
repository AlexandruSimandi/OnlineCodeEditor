/**
 * Created by rober on 10/04/2016.
 */
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('loading express', function(){

    var application;

    //we will load the express server (our app) before each test
    beforeEach(function() {

        application = require('../server');
        application.app.set('env', 'test');

    });

    //we will close the server after each test
    afterEach(function() {

        application.server.close();

    });

    it('response to /', function testSlash(done){

        request(application.server)
            .get('/')
            .end(function(err, res){

                if(err)
                    return done(err);

                console.log(res.header['location']);
                expect(res.header['location']).to.include('/');
                done();

            });

    });

    it('404 to other path', function testOtherPath(done){

        request(application.server)
            .get('/foo/bar')
            .expect(404, done);

    });

});