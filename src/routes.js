const express = require("express");
const routes = express.Router();

const basepath = __dirname+"/views/";

const Profile = {
    data: {
        name: "Diogo Santiago",
        avatar: "https://avatars.githubusercontent.com/u/6208518?v=4",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(req, res){
            return res.render(basepath+"profile", {profile: Profile.data});
        },

        update(req, res){
            const data = req.body;
            const weeksPerYear = 52;
            const weeksPerMounth = (weeksPerYear - data['vacation-per-year']) / 12;
            const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
            const monthlyTotalHours = weekTotalHours * weeksPerMounth;
            data['value-hour'] = data['monthly-budget'] / monthlyTotalHours;

            Profile.data = data;
            return res.redirect('/profile');
        }
    }
}

const Job = {
    data: [
        {id: 1, name: "Pizzaria Guloso", "daily-hours": 2,"total-hours": 1, created_at: Date.now()},
        {id: 2, name: "OneTwo Project", "daily-hours": 3,"total-hours": 47, created_at: Date.now()}
    ],

    controllers: {
        index(req, res){
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job);
                const status = remaining < 1 ? "done" : "progress";
                const budget = Job.services.calculateBudget(job, Profile.data['value-hour']);
                return {...job, remaining, status, budget};
            });

            return res.render(basepath+"index", { jobs: updatedJobs });
        },

        create(req, res){
            return res.render(basepath+"job");
        },

        save(req, res){
            // req.body = { name: '1', 'daily-hours': '1', 'total-hours': '1' }
            // console.log(req.body);
            const id = Job.data[Job.data.length-1]?.id+1 || 1;
        
            Job.data.push({
                id,
                name: req.body.name,
                'daily-hours': req.body['daily-hours'],
                'total-hours': req.body['total-hours'],
                created_at: Date.now(),
            });
            return res.redirect('/');
        },

        show(req, res){
            const job = Job.data.find(job => req.params.id == job.id);
            if(!job){
                res.send('Job não encontrado');
            }
            job.budget = Job.services.calculateBudget(job, Profile.data['value-hour']);

            return res.render(basepath+"job-edit", {job});
        },

        update(req, res){
            const job = Job.data.find(job => req.params.id == job.id);
            if(!job){
                res.send('Job não encontrado');
            }

            const updatedJob = {
                ...job,
                ...req.body,
            }

            Job.data = Job.data.map(job => {
                return (job.id == updatedJob.id)? updatedJob : job;
            });

            return res.redirect('/job/'+updatedJob.id);
        },

        delete(req, res){
            Job.data = Job.data.filter(job => job.id != req.params.id);

            return res.redirect('/');
        }
    },

    services: {
        remainingDays(job){
            const remainingDays = (job['total-hours']/job['daily-hours']).toFixed();
            const createdDate = new Date(job.created_at);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            const timeDiffInMs = dueDateInMs -Date.now();
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
        
            return dayDiff;
        },

        calculateBudget: (job, valueHour) => valueHour*job['total-hours']
    }
}

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);


module.exports = routes;