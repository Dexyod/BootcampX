const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "bootcampx",
});

pool
  .query(
    `
SELECT id, name, cohort_id
FROM students
LIMIT 5;
`
  )
  .then((res) => {
    console.table(res.rows);
  })
  .catch((err) => console.error("query error", err.stack));

const [, , date, limit] = process.argv;
const values = [`%${date}%`, limit || 5];
pool
  .query(
    `SELECT students.id as id, students.name as student, cohorts.name as cohort
    FROM students JOIN cohorts ON cohort_id = cohorts.id
    WHERE cohorts.name LIKE $1
    LIMIT $2;`,
    values
  )
  .then((res) => {
    res.rows.forEach((user) => {
      console.log(
        `${user.student} has an id of ${user.id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch((err) => console.error("query error", err.stack));
