const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async index(req, res) {
    let jobTotalHours = 0;
    const profile = await Profile.get();
    const jobs = await Job.get();

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining < 1 ? "done" : "progress";
      const budget = JobUtils.calculateBudget(job, profile["value-hour"]);
      jobTotalHours += status == "progress" && Number(job["daily-hours"]);
      return { ...job, remaining, status, budget };
    });

    statusCount = {
      progress: updatedJobs.filter((job) => job.status == "progress").length,
      done: updatedJobs.filter((job) => job.status == "done").length,
      total: updatedJobs.length,
    };

    const freehours = profile["hours-per-day"] - jobTotalHours;
    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount,
      freehours,
    });
  },
};
