const knex = require('../dbconfig').knex;
const bookshelf = require('bookshelf')(knex);

const registeration = bookshelf.Model.extend({
    tableName: 'registeration'
});

module.exports = registeration;
