var express = require('express');
var router = express.Router();
var app = require('../app');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../routes/api');
let should = chai.should();
var index = require('../routes/index');

const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);


describe('POST register students to specified teacher', () => {
    it('should respond with 204', (done) => {
      chai
      .request(app)
      .post('/api/register')
      .send({
        teacher: 'teachertest@gmail.com',
        students: ["studenttestA@gmail.com","studenttestB@example.com"]
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(204);
        done();
      });
    });
  });


describe('GET common students - 1 teacher', () => {
    it('retrieved list', (done) => {
        chai
            .request(app)
            .get('/api/commonstudents?teacher=teacherken%40gmail.com')
            .end(function (err, res) {
                res.body.should.have.property('students').to.be.an.instanceof(Array);
                const result = res.statusCode
                expect(result).to.equal(200)
                res.type.should.equal('application/json');

                done()
            })
    })
})

describe('GET common students - 2 teachers', () => {
    it('retrieved list', (done) => {
        chai
            .request(app)
            .get('/api/commonstudents?teacher=teacherjim%40gmail.com&teacher=teacherken%40gmail.com')
            .end(function (err, res) {

                res.body.should.have.property('students').to.be.an.instanceof(Array);
                const result = res.statusCode
                expect(result).to.equal(200)
                res.type.should.equal('application/json');

                done()
            })
    })
})

describe('POST suspend specific student', () => {
    it('should respond with 204', (done) => {
      chai
      .request(app)
      .post('/api/suspend')
      .send({
        student: 'studenttestB@example.com',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(204);
        done();
      });
    });
  });


  describe('POST receipient list', () => {
    it('should respond with list of recipients', (done) => {
      chai
      .request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: "teacherken@gmail.com", 
        notification : "Hello students! @studentagnes@example.com @studentmiche@example.com",
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.have.property('recipients').to.be.an.instanceof(Array);

        done();
      });
    });
  });