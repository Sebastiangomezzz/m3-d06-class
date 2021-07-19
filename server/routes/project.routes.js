const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/Project.model');

router.post('/', (req, res)=>{
    const { title, description } = req.body
    
    Project.create({
        title,
        description
    })
    .then(
        createdProject => res.json(createdProject)
    )
    .catch(err=>json(err))
})

module.exports = router