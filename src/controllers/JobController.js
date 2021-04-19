const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {
    // index(req, res){
    //     const updatedJobs = Job.get().map((job) => {
    //         const remaining = JobUtils.remainingDays(job);
    //         const status = remaining < 1 ? "done" : "progress";
    //         const budget = JobUtils.calculateBudget(job, Profile.get()['value-hour']);
    //         return {...job, remaining, status, budget};
    //     });

    //     return res.render("index", { jobs: updatedJobs });
    // },

    create(req, res){
        return res.render("job");
    },

    async save(req, res){
        Job.create({
            name: req.body.name,
            'daily-hours': req.body['daily-hours'],
            'total-hours': req.body['total-hours'],
            created_at: Date.now(),
        });
        return res.redirect('/');
    },

    async show(req, res){
        const jobs = await Job.get();
        const profile = await Profile.get();
        const job = jobs.find(job => req.params.id == job.id);
        if(!job){
            res.send('Job não encontrado');
        }
        job.budget = JobUtils.calculateBudget(job, profile['value-hour']);

        return res.render("job-edit", {job});
    },

    async update(req, res){
        console.log(req.body);
        const updatedJob = {
            id: req.params.id,
            ...req.body,
        }

        await Job.update(updatedJob);

        return res.redirect('/job/'+updatedJob.id);
    },

    delete(req, res){
        Job.delete(req.params.id);

        return res.redirect('/');
    }
}