// routes/project.routes.js
 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/Project.model')

router.post('/', (req, res)=>{
    const { title, description } = req.body

    Project.create({
        title,
        description
    })
    .then( createdProject => res.json(createdProject))
    .catch(err=>res.json(err))
})


router.get('/', (req, res)=>{
    Project.find()
    .populate('tasks')
    .then( allTheProjects => res.json(allTheProjects))
    .catch(err=>res.json(err))
})

router.get('/:projectId', (req, res, next) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    // Our projects have array of tasks' ids and
    // we can use .populate() method to get the whole task objects
    Project.findById(projectId)
      .populate('tasks')
      .then(project => res.status(200).json(project))
      .catch(error => res.json(error));
  });


module.exports = router
// the same as 'export defualt' that we have used in frontend code