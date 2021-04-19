const Database = require("../db/config");

// let data = [
//   {
//     id: 1,
//     name: "Pizzaria Guloso",
//     "daily-hours": 2,
//     "total-hours": 1,
//     created_at: Date.now(),
//   },
//   {
//     id: 2,
//     name: "OneTwo Project",
//     "daily-hours": 3,
//     "total-hours": 47,
//     created_at: Date.now(),
//   },
// ];

module.exports = {
  async get() {
    const db = await Database();
    const jobs = await db.all(`SELECT * FROM jobs`);
    await db.close();

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      "daily-hours": job.daily_hours,
      "total-hours": job.total_hours,
      created_at: job.created_at,
    }));
  },
  async update(job) {
    const db = await Database();
    await db.run(`UPDATE jobs SET
      name = "${job.name}",
      daily_hours = ${job["daily-hours"]},
      total_hours = ${job["total-hours"]}
    WHERE id = ${job.id}`);
    await db.close();
  },
  async delete(id) {
    const db = await Database();
    await db.run(`DELETE FROM jobs WHERE id = ${id}`);
    await db.close();
  },
  async create(job) {
    const db = await Database();
    await db.run(`INSERT INTO jobs
    (
        name,
        daily_hours,
        total_hours,
        created_at
    ) VALUES (
        "${job.name}",
        ${job["daily-hours"]},
        ${job["total-hours"]},
        ${job.created_at}
    );`);
    await db.close();
  },
};
