const knex = require('../dbconfig').knex;
const bookshelf = require('bookshelf')(knex);

const teacher = bookshelf.Model.extend({
    tableName: 'teacher',
    idAttribute: 'TEACHER_EMAIL'
});

module.exports = teacher;
