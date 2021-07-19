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

router.get('/:projectId', (req, res) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findById(projectId)
      .populate('tasks')
      .then(project => res.json(project))
      .catch(err => res.json(err));
});


router.put('/:projectId', (req, res, next) => {
    const { projectId } = req.params;
    const { title, description, tasks } = req.body
    // This very simple check is useful for the lesson, it may become more cmplex in extended applications
    // Normally you would let mongoose do this in the validation step
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndUpdate(projectId, { title, description, tasks }, {new: true})
      .then((newProject) => res.json(newProject))
      .catch(error => res.json(error));
});

router.delete('/:projectId', (req, res) => {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndRemove(projectId)
      .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
      .catch(error => res.json(error));
});
   

module.exports = router
// the same as 'export defualt' that we have used in frontend code