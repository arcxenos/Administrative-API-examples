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

//for registering students to teacher - POSTIVE FLOW
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

//for registering students to teacher, MISSING EMAIL - NEGATIVE FLOW
describe('POST register students to specified teacher, Missing Teacher Email', () => {
  it('should respond with 500 and has message', (done) => {
    chai
    .request(app)
    .post('/api/register')
    .send({
      teacher: '',
      students: ["studenttestA@gmail.com","studenttestB@example.com"]
    })
    .end((err, res) => {
      console.log(res.body);
      should.not.exist(err);
      res.status.should.equal(500);
      res.body.should.have.property('message','Email provided is not correct or is empty');
      done();
    });
  });
});
//for registering students to teacher, INVALID EMAIL - NEGATIVE FLOW
describe('POST register students to specified teacher, Invalid Email ', () => {
  it('should respond with 500 and has message', (done) => {
    chai
    .request(app)
    .post('/api/register')
    .send({
      teacher: 'teachertest',
      students: ["studenttestA@gmail.com","studenttestB@example.com"]
    })
    .end((err, res) => {
      console.log(res.body);
      should.not.exist(err);
      res.status.should.equal(500);
      res.body.should.have.property('message','Email provided is not correct or is empty');
      done();
    });
  });
});

//for registering students to teacher, INVALID EMAIL LENGTH - NEGATIVE FLOW
describe('POST register students to specified teacher, Email length over 255 ', () => {
  it('should respond with 500 and has message', (done) => {
    chai
    .request(app)
    .post('/api/register')
    .send({
      teacher: 'teachertestsuperlongnametestthiscannotbeenteredintodbbecauseitistoolongicannotbelievesomeonewillhavethislongemailohmansupperlognasdnasodkteachertestsuperlongnametestthiscannotbeenteredintodbbecauseitistoolongicannotbelievesomeonewillhavethislongemailohmansupperlognasdnas@gmail',
      students: ["studenttestA@gmail.com","studenttestB@example.com"]
    })
    .end((err, res) => {
      console.log(res.body);
      should.not.exist(err);
      res.status.should.equal(500);
      res.body.should.have.property('message','Email provided exceeds 255 length');
      done();
    });
  });
});
// for retrieving list of common students, 1 teacher POSTIVE FLOW
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
// for retrieving list of common students, multiple teachers with common students -POSTIVE FLOW
describe('GET common students - 2 teachers with common students', () => {
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
// for retrieving list of common students, multiple teachers with no common students -POSTIVE FLOW
describe('GET common students - 2 teachers with no common students', () => {
  it('retrieved list with no students', (done) => {
      chai
          .request(app)
          .get('/api/commonstudents?teacher=teacherjim%40gmail.com&teacher=teacherlam%40gmail.com')
          .end(function (err, res) {

              res.body.should.have.property('students').to.be.instanceof(Array);
              res.body.should.have.property('students').to.have.length.below(1);
              const result = res.statusCode
              expect(result).to.equal(200)
              res.type.should.equal('application/json');

              done()
          })
  })
})
// for retrieving list of common students, NO TEACHERS SUPPLIED -NEGATIVE FLOW
describe('GET common students - 0 teacher, request field present', () => {
  it('should respond with 500 and has message', (done) => {
      chai
          .request(app)
          .get('/api/commonstudents?teacher=')
          .end(function (err, res) {
              const result = res.statusCode
              expect(result).to.equal(500)
              res.type.should.equal('application/json');
              res.body.should.have.property('message','Unable to retrieve common list of students because no teacher emails are supplied');
              done()
          })
  })
})

// for retrieving list of common students, NO TEACHERS FIELD present -NEGATIVE FLOW
describe('GET common students - 0 teacher, request field not present', () => {
  it('should respond with 500 and has message', (done) => {
      chai
          .request(app)
          .get('/api/commonstudents')
          .end(function (err, res) {
              const result = res.statusCode
              expect(result).to.equal(500)
              res.type.should.equal('application/json');
              res.body.should.have.property('message','Unable to retrieve common list of students because no teacher emails are supplied'); 
              done()
          })
  })
})
// for suspending specific student POSTIVE FLOW
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
 
 // for suspending unknown student NEGATIVE FLOW
describe('POST suspend known student', () => {
  it('should respond with 500 and has message ', (done) => {
    chai
    .request(app)
    .post('/api/suspend')
    .send({
      student: 'studenttestX@example.com',
    })
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(500);
      res.body.should.have.property('message','Unable to update status of Student studenttestX@example.com due to error of student email, check if student exists'); 
      done();
    });
  });
}); 

 // for suspending missing student NEGATIVE FLOW
 describe('POST suspend missing student', () => {
  it('should respond with 500 and has message ', (done) => {
    chai
    .request(app)
    .post('/api/suspend')
    .send({
      student: "",
    })
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.equal(500);
      res.body.should.have.property('message','No Students specified'); 
      done();
    });
  });
}); 


  //for retrieving a list of recipients with no notifications students POSTIVE FLOW
  describe('POST receipient list', () => {
    it('should respond with list of recipients', (done) => {
      chai
      .request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: "teacherken@gmail.com", 
        notification : "",
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

  //for retrieving a list of recipients with @mentioned students POSTIVE FLOW
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
        res.body.should.have.property('recipients').to.be.contain('studentagnes@example.com');
        res.body.should.have.property('recipients').to.be.contain('studentmiche@example.com');

        done();
      });
    });
  });

    //for retrieving a list of recipients but no teacher specified NEGATIVE FLOW
    describe('POST receipient list', () => {
      it('should respond 500 with message', (done) => {
        chai
        .request(app)
        .post('/api/retrievefornotifications')
        .send({
          teacher: "", 
          notification : "Hello students!",
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.should.have.property('message','No Teacher specified');
          done();
        });
      });
    });


