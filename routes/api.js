var express = require('express');
var router = express.Router();

const knex = require('../dbconfig').knex;
const teacherModel = require('../model/teacher');
const studentModel = require('../model/student');
const registerationModel = require('../model/registeration');

const winston = require('winston');
const getEmails = require('get-emails');

const consoleTransport = new winston.transports.Console()
const options = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(options)


async function checkAndInsertTeacher(teacherEmail)
{
    try {

        let val = await teacherModel.where({ 'TEACHER_EMAIL': teacherEmail }).fetch({require:true});
        return true;
    } catch (e) {
        logger.info(`Teacher does not exist, adding to Table`);

        try {

            let val = await teacherModel.forge({ 'TEACHER_EMAIL': teacherEmail}).save(null, {method: 'insert'});
            return true;
        } catch (e) {
            return false;
        } 
    } 
}
async function checkAndInsertStudent(studentEmail)
{
    try {
        let val = await studentModel.where({'STUDENT_EMAIL': studentEmail}).fetch({require:true});
        return true;
    } catch (e) {
        try {

            let val = await studentModel.forge({ 'STUDENT_EMAIL': studentEmail}).save(null, {method: 'insert'});
            return true;
        } catch (e) {
            return false;
        } 
    } 
}

async function registerTeacherAndStudent(teacherEmail,studentEmail)
{
    try {
        let val = await registerationModel.forge({ 'TEACHER_EMAIL': teacherEmail, 'STUDENT_EMAIL': studentEmail}).save(null, {method: 'insert'});
        return true;
    } catch (e) 
    {
        res.status(500).send({ message: "Failed to register Teacher "+ teacherEmail+" with Student "+ studentEmail, error: e });

        return false;

    } 
}

router.post('/register', async function (req, res, next) {
    try {
      if (!req.query.api) {
        var teacherEmail = req.body.teacher;
        var students = req.body.students;

        try
        {
            var result = await checkAndInsertTeacher(teacherEmail);
            if(!result)
            {
                res.status(500).send({ message: "Failed to obtain Teacher "+ teacherEmail, error: e });

            }
        }
        catch(e)
        {
            res.status(500).send({ message: "Failed to obtain Teacher "+ teacherEmail, error: e });

        }

        students.forEach(async (element, res) => {
            try{
                var result = await checkAndInsertStudent(element);
                if(result)
                {
                    var inserted = await registerTeacherAndStudent(teacherEmail, element);
                    if(!inserted)
                    {
                        res.status(500).send({ message: "Failed to register Teacher "+ teacherEmail+" with Student "+ element, error: e });
                    }
                }
            }
            catch(e)
            {
                res.status(500).send({ message: "Failed to register Teacher "+ teacherEmail+" with Student "+ element, error: e });
            }
        });
      }

      res.sendStatus(204);

    }
    catch (e) {
        res.status(500).send({ message: "Failed to register Teacher with Students, contact administrator ", error: e });
    }
  });

async function generateCommonMap(Teachers)
{
    let studentMap = new Map();
    var internalCounter = 0;
    var teacherCount = Teachers.length;

    for(i = 0; i < teacherCount; i++)
    {
        try{
            const service =  await knex.select('STUDENT_EMAIL').distinct().from('registeration').where('TEACHER_EMAIL', Teachers[i]).returning().then(result => {return result});
            for( j = 0; j< service.length;j++)
            {
                var target = service[j].STUDENT_EMAIL;
                if(!studentMap.get(target))
                {
                    studentMap.set(target,1);
                }
                else
                {
                    var tempCount = studentMap.get(target);
                    studentMap.set(target,tempCount + 1 );
                }
            }
        }
        catch(error)
        {
            return false;
        }
    }
    return studentMap;
}


router.get('/commonstudents', async function (req, res, next) {
try{
    var Teachers = req.query.teacher;

    if(Array.isArray(Teachers))
    {
        //if it is an Array of teachers (i.e. more than 1 in get request)
        var teacherCount = Teachers.length;
        var studentMap = new Map();
        var Students = [];
        try{
            let studentTar = await generateCommonMap(Teachers);

            if(studentTar == false)
            {
                res.status(500).send({ message: "Failed to Obtain list of Common Students", error: "" });
            }

            for (let [k, v] of studentTar) {
                if (v == teacherCount)
                {
                    Students.push(k);
                }
            }
            var temp ={};
            temp.students = Students;
            console.log(temp);
            res.json(temp);
        }
        catch(error)
        {
            res.status(500).send({ message: "Unable to retrieve list of students, please contact an Administrator", error: error });
        }
    }
    else
    {
        // there is only 1 teacher in get request
        try
        {
            var Students = [];
            const service =  await knex.select('STUDENT_EMAIL').distinct().from('registeration').where('TEACHER_EMAIL', Teachers).returning().then(result => {return result});
            for( i = 0; i< service.length;i++)
            {
                Students.push(service[i].STUDENT_EMAIL);
            }
            var temp ={};
            temp.students = Students;
            console.log(temp);
            res.json(temp);
        }
        catch(e)
        {
            res.status(500).send({ message: "Unable to retrieve list of students for Teacher " + Teachers+" please contact an Administrator", error: e });
        }
    }
}
catch(e)
{
    res.status(500).send({ message: "Unable to retrieve list of students, please contact an Administrator", error: e });
}
});

router.post('/suspend', async function (req, res, next) {
    try {
      if (!req.query.api) {
        var student = req.body.student;
        var test = false;
        try {
            let val = await knex('student').where({STUDENT_EMAIL: student}).update({STUDENT_STATUS: "SUSPENDED"});
            if(val != 1)
            {
                throw "Failed to update or student does not exist";
            }
        } catch (e) {
            res.status(500).send({ message: "Failed to suspend Student, contact administrator ", error: e });
            return false;
        } 
      }

      res.sendStatus(204);

    }
    catch (e) {
        res.status(500).send({ message: "Failed to suspend Student, contact administrator ", error: e });
    }
  });

function findEmailAddresses(StrObj) {
    const text = StrObj;
    var targets = getEmails(text);
    var tarArr = Array.from(targets);
    return tarArr;
}
router.post('/retrievefornotifications', async function (req, res, next) {
    try {
      if (!req.query.api) {
        var teacher = req.body.teacher;
        var notificationString = req.body.notification;
    
        var supplmenentEmails = findEmailAddresses(notificationString); // grab an array of emails that were personally @ with
        var Students = [];

        let studentMap = new Map();
        try{
            const registeredStudents =  await knex.select('STUDENT_EMAIL').distinct().from('registeration').where('TEACHER_EMAIL', teacher).returning().then(result => {return result});
            for( j = 0; j< registeredStudents.length;j++)
            {
                var target = registeredStudents[j].STUDENT_EMAIL;
                if(!studentMap.get(target))
                {
                    studentMap.set(target,1);
                }
            }
        }
        catch(e)
        {
            res.status(500).send({ message: "Failed to retrieve registered students to teacher, contact administrator ", error: e });
        }
        //process supplmentary notification targets, requirement stated NO SUSPENDED allowed
        for(i = 0 ; i< supplmenentEmails.length;i++)
        {
            studentMap.set(supplmenentEmails[i],1);
        }

        console.log(studentMap);

        try{
            const suspendedStudents =  await knex.select('STUDENT_EMAIL').distinct().from('student').where('STUDENT_STATUS', "SUSPENDED").returning().then(result => {return result});
            for( j = 0; j< suspendedStudents.length;j++)
            {
                var target = suspendedStudents[j].STUDENT_EMAIL;
                if(studentMap.get(target))
                {
                    //if there is suspended student in the list, drop them
                    studentMap.delete(target);
                }
            }
        }
        catch(error)
        {
            //error in processing
            res.status(500).send({ message: "Failed to retrieve suspended students, contact administrator ", error: e });
        }


        //transform to json and send
        for (let [k, v] of studentMap) {
            Students.push(k);
        }
        var temp ={};
        temp.recipients = Students;
        res.json(temp);
      }

    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Failed to retrieve mailing student list, contact administrator ", error: e });
    }
  });

module.exports = router;