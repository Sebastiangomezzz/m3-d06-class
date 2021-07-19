// routes/project.routes.js
 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Task = require('../models/Task.model')

router.post('/', (req, res)=>{
    const { project, title, description } = req.body

    Task.create({
        project,
        title,
        description
    })
    .then( createdTask => res.json(createdTask))
    .catch(err=>res.json(err))
})

module.exports = router
// the same as 'export defualt' that we have used in frontend code