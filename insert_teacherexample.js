var options = require('./dbconfig');

console.log(options);
const knex = require('knex')(options);

const teachers = [
    { teacher_uid: "123125", teacher_name: "test", teacher_email: "13@gmail.com" },
    { teacher_uid: "123126", teacher_name: "test2", teacher_email: "14@gmail.com" },

]


knex.from('teacher').select("*")
    .then((rows) => {
        for (row of rows) {
            console.log(row);
            console.log(`${row['TEACHER_UID']} ${row['TEACHER_NAME']} ${row['TEACHER_EMAIL']}`);
        }
    }).catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });

// knex('teacher').insert(teachers).then(() => console.log("data inserted"))
//     .catch((err) => { console.log(err); throw err })
//     .finally(() => {
//         knex.destroy();
//     });