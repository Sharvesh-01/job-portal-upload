const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    location: String,
    education: String,
    yearsOfExperience: Number,
    workExperience: String,
    skills: String,
    resume: String,
    profilePhoto:String
},{
    collecion:"jobseekers",
});

const JobSeeker = mongoose.model('jobseekers', jobSeekerSchema);

module.exports = JobSeeker;
