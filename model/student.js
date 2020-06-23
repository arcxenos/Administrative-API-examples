// OLD MODEL THAT IS NOT USED ANYMORE

const knex = require('../dbconfig').knex;
const bookshelf = require('bookshelf')(knex);
const student = bookshelf.Model.extend({
    tableName: 'student',
    idAttribute: 'STUDENT_EMAIL'
});

module.exports = student;
