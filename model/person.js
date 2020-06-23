const knex = require('../dbconfig').knex;
const bookshelf = require('bookshelf')(knex);

const person = bookshelf.Model.extend({
    tableName: 'user',
    idAttribute: 'email'
});

module.exports = person;
