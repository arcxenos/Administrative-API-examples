var express = require('express');
var router = express.Router();

const knex = require('../dbconfig').knex;
const teacherModel = require('../model/teacher');
const studentModel = require('../model/student');
const personModel = require('../model/person');

const registerationModel = require('../model/registeration');
const winston = require('winston');
const getEmails = require('get-emails');
const consoleTransport = new winston.transports.Console()
const options = {
    transports: [consoleTransport]
}
function errorHandler(errorMsg,rawError) {
    var temp = {};
    temp.message = errorMsg; // the specific contextual error that is to be captured
    temp.raw = rawError; // the raw error log
    return temp;
}
function testEmail(input)   /* used to test if input is in email format and does not exceed 255 characters (255 set as limit in db) before input into db*/
{
    var targets = Array.from(getEmails(input)); // check if target is an email string
    console.log(targets);
    if(targets[0] == null ||targets[0] == "") // is not an email string
    {
        var message = "Email provided is not correct or is empty";
        var e = "String provided is not in email format";
        return errorHandler(message,e);
    }
    if(input.length > 255) // length exceeded 255
    {
        var message = "Email provided exceeds 255 length";
        var e = "Email length too long";
        return errorHandler(message,e);
    }
    return true;
}
async function checkAndInsertAccount(email,role)   /* Function checks if user account is inside the db, if not, add the user*/
{
    var emailCheck = testEmail(email); //check if email
    if(typeof emailCheck === 'object' && emailCheck !== null) //return is an error message
    {
        return emailCheck;
    }
    try 
    {
        await personModel.where({ 'email': email}).fetch({require:true}); //test if account exists
        return true; 
    } 
    catch (e) 
    {
        //error in selecting user, means user not found in DB, so we try to insert it as new user
        try 
        {
            await personModel.forge({ 'email': email, 'role' : role}).save(null, {method: 'insert'}); //attempt to insert user into table
            return true;
        } 
        catch (e) 
        {
            //error in inserting user into db
            var message = "Unable to create User : " + email + "due to error in inserting user record into db";
            return errorHandler(message,e);
        } 
    } 
}
async function registerTeacherAndStudent(teacherEmail,studentEmail) /* called after checking that both teacher and student are already registered, aim to insert the pair into registeration table */
{
    try 
    {
        let val = await registerationModel.forge({ 'teacher_email': teacherEmail, 'student_email': studentEmail}).save(null, {method: 'insert'});  //to insert into registeration
        return true;
    } 
    catch (e) 
    {
        //failed to insert
        var message = "Unable to register Teacher : " +teacherEmail+ " with Student : " + studentEmail + "due to error in inserting record into db"; 
        return errorHandler(message,e);
    } 
}
async function generateCommonMap(teachers) /* called to return a map that contains a cumulative set of ALL students that are registered to teachers, to be processed later */ 
{
    let studentMap = new Map();
    var teacherCount = teachers.length;
    // Iterate through the amount of teachers supplied by request, then put distinct students into a map for each teacher, incrementing every time the same student gets called.
    for(i = 0; i < teacherCount; i++)
    {
        try
        {
            const service =  await knex.select('student_email').distinct().from('registeration').where('teacher_email', teachers[i]).returning().then(result => {return result}); //list of all students for a specific teacher
            for( j = 0; j< service.length;j++)
            {
                var target = service[j].student_email;
                if(!studentMap.get(target))
                {
                    studentMap.set(target,1); // if student did not appear in the set before, set 1 for first appearance
                }
                else
                {
                    var tempCount = studentMap.get(target);
                    studentMap.set(target,tempCount + 1); //student did appear before, increase appearence count
                }
            }
        }
        catch(e)
        {
            var message = "Unable to obtain list of registered students for Teacher "+ teachers[i] +" due to error in accessing registered records";
            return errorHandler(message,e);
        }
    }
    return studentMap;
}
function findEmailAddresses(StrObj) /* used to obtain all emails present in the given string */
{
    const text = StrObj;
    var tarArr = Array.from(getEmails(text));     //code to extract email from given string, converts from a set to array
    return tarArr;
}
router.post('/register', async function (req, res, next)
{
    try {
      if (!req.query.api) 
      {
        var teacherEmail = req.body.teacher;
        var students = req.body.students;
        // First check if teacher exists, if not, insert into db, then check all students if they exist, and insert into db if they are not. Once the pair is verified, begin insertion into db
        try
        {
            var result = await checkAndInsertAccount(teacherEmail,1); // 1 is used to denote the role ID, in db 1 is set to teacher

            if(typeof result === 'object' && result !== null) //if a message object is returned, that means error has been met
            {
                return res.status(500).json(result);
            }
        }
        catch(e)
        {
            //general capture message if error is not with db operation
            var message = "There is an error retrieving Teacher record for"+ teacherEmail;
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
        for(i=0; i< students.length; i++)
        {
            try
            {
                var result = await checkAndInsertAccount(students[i],2); //2 is used to denote the role ID, in db 2 is set to student
                if(typeof result === 'object' && result !== null) 
                {
                    return res.status(500).json(result);
                }
                // else, existence of student confirmed, register with teacher
                var inserted = await registerTeacherAndStudent(teacherEmail, students[i]);
                if(typeof inserted === 'object' && result !== null)
                {
                    return res.status(500).json(result);
                }
            }
            catch(e)
            {
                var message = "Failed to register Teacher "+ teacherEmail+" with Student "+ students[i] +" due to failure to insert record into db";
                var gen = errorHandler(message,e);
                return res.status(500).json(gen);
            }
        }
      }
      res.sendStatus(204); // operation success
    }
    catch (e) 
    {
        // general capture message if error is not with db operation
        var message = "Failed to register Teacher with Students, contact administrator";
        var gen = errorHandler(message,e);
        return res.status(500).json(gen);
    }
});
router.get('/commonstudents', async function (req, res, next) {
    try{
        var Teachers = req.query.teacher;
        if(Teachers == null || Teachers == "")
        {
            var message = "Unable to retrieve common list of students because no teacher emails are supplied" ;
            var e = "Empty request field for teachers"
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
        if(Array.isArray(Teachers))
        {
            //if it is an Array of teachers (i.e. more than 1 in get request)
            var teacherCount = Teachers.length;
            var Students = [];
            try
            {
                let studentTar = await generateCommonMap(Teachers); // get a map of all students
               // if(typeof studentTar instanceof Map) 
               if(studentTar.hasOwnProperty("message")) // if return is actually a message
                {
                    return res.status(500).json(studentTar); // if it is not a map, means error was met
                }
                for (let [k, v] of studentTar) 
                {
                    if (v == teacherCount)     // iterate through target map, If student is called the same amount as teachers supplied, it means student is present for all teachers involved
                    {
                        Students.push(k);
                    }
                }
                var temp ={};
                temp.students = Students;
                console.log(temp);
                res.json(temp);

            }
            catch(e)
            {
                console.log(e);
                var message = "Unable to retrieve common list of students because there was an error in obtaining student records" ;
                var gen = errorHandler(message,e);
                return res.status(500).json(gen);
            }
        }
        else
        {
            // there is only 1 teacher in get request
            try
            {
                var Students = [];
                const service =  await knex.select('student_email').distinct().from('registeration').where('teacher_email', Teachers).returning().then(result => {return result}); //get list of students
                for( i = 0; i< service.length;i++)
                {
                    Students.push(service[i].student_email);
                }
                var temp ={};
                temp.students = Students;
                console.log(temp);
                res.json(temp);
            }
            catch(e)
            {
                var message = "Unable to retrieve list of students for Teacher " + Teachers +" due to error in obtaining student records";
                var gen = errorHandler(message,e);
                return res.status(500).json(gen);
            }
        }
    }
    catch(e)
    {
        // general capture message if error is not with db operation
        console.log(e);

        var message = "Unable to retrieve list of students, please contact an Administrator";
        var gen = errorHandler(message,e);
        return res.status(500).json(gen);
    }
});
router.post('/suspend', async function (req, res, next) {
    try 
    {
      if (!req.query.api) 
      {

        var student = req.body.student;
        if(student == "")
        {
            var message = "No Students specified";
            var e = "No targets submitted, please check input";
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
        var emailCheck = testEmail(student); //check if email
        if(typeof emailCheck === 'object') //return is an error message
        {
            return emailCheck;
        }
        let val = await knex('user').where({email: student}).update({status: "SUSPENDED"}); //returns an amount of updated records
        if(val != 1) // if none updated, there is an issue
        {
            var message = "Unable to update status of Student "+ student+" due to error of student email, check if student exists";
            var e = "student status update error, db return count of 0";
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
      }
      res.sendStatus(204);
    }
    catch (e) 
    {
        // general capture message if error is not with db operation
        var message = "Failed to suspend Student, contact administrator";
        var gen = errorHandler(message,e);
        return res.status(500).json(gen);
    }
});
router.post('/retrievefornotifications', async function (req, res, next) {
    try 
    {
      if (!req.query.api) 
      {
        var teacher = req.body.teacher;
        var notificationString = req.body.notification;

        if(teacher == "")
        {
            var message = "No Teacher specified";
            var e = "No targets submitted, please check input";
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
    
        var supplmenentEmails = findEmailAddresses(notificationString); // grab an array of emails that were personally @ with
        var Students = [];
        let studentMap = new Map();
        try
        {
            const registeredStudents =  await knex.select('student_email').distinct().from('registeration').where('teacher_email', teacher).returning().then(result => {return result});
            for( j = 0; j< registeredStudents.length;j++)
            {
                var target = registeredStudents[j].student_email;
                if(!studentMap.get(target))
                {
                    studentMap.set(target,1);
                }
            }
        }
        catch(e)
        {
            var message = "Failed to retrieve registered students to teacher due to error in obtaining list of students from db";
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
        //process supplmentary notification targets, requirement stated NO SUSPENDED allowed so process supplement first, to be remove if suspended found
        for(i = 0 ; i< supplmenentEmails.length;i++)
        {
            studentMap.set(supplmenentEmails[i],1);
        }
        try
        {
            const suspendedStudents =  await knex.select('email').distinct().from('user').where('status', "SUSPENDED").andWhere('role','2').returning().then(result => {return result});
            for( j = 0; j< suspendedStudents.length;j++)
            {
                var target = suspendedStudents[j].email;
                if(studentMap.get(target))
                {
                    //if there is suspended student in the map, drop them
                    studentMap.delete(target);
                }
            }
        }
        catch(e)
        {
            //error in processing
            var message = "Failed to complete operation due to error in retrieving list of suspended students from db";
            var gen = errorHandler(message,e);
            return res.status(500).json(gen);
        }
        //transform to json and send
        for (let [k, v] of studentMap) 
        {
            Students.push(k);
        }
        var temp ={};
        temp.recipients = Students;
        res.json(temp);
      }
    }
    catch (e) 
    {
        console.log(e);
        var message = "Failed to retrieve mailing student list, contact administrator";
        var gen = errorHandler(message,e);
        return res.status(500).json(gen);
    }
});

module.exports = router;