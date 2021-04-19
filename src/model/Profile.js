const Database = require("../db/config");

// let data = {
//   name: "Diogo Santiago",
//   avatar: "https://avatars.githubusercontent.com/u/6208518?v=4",
//   "monthly-budget": 3000,
//   "hours-per-day": 5,
//   "days-per-week": 5,
//   "vacation-per-year": 4,
//   "value-hour": 75,
// };

module.exports = {
  async get() {
    const db = await Database();
    const data = await db.get(`SELECT * FROM profile`);
    await db.close();

    return {
      name: data.name,
      avatar: data.avatar,
      "monthly-budget": data.monthly_budget,
      "days-per-week": data.days_per_week,
      "hours-per-day": data.hours_per_day,
      "vacation-per-year": data.vacation_per_year,
      "value-hour": data.value_hour
    };
  },
  async update(param) {
    // data = param;
    const db = await Database();
    const data = await db.get(`UPDATE profile SET
        name = "${param.name}",
        avatar = "${param.avatar}",
        monthly_budget = ${param["monthly-budget"]},
        days_per_week = ${param["days-per-week"]},
        hours_per_day = ${param["hours-per-day"]},
        vacation_per_year = ${param["vacation-per-year"]},
        value_hour = ${param["value-hour"]}`);
    await db.close();
  },
};
