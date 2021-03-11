const router = require('express').Router();
const mongoose = require('mongoose');

const User = require("../models/users.model");
const Exercise = require('../models/exerices.model');

router.post('/new-user', (req,res) => {
  const {username} = req.body;
  User.findOne({username}).then(user => {
    if(user) {
        return res.status(400).json("user already taken");
    }
    const newUser = new User({
      username
    });
    newUser.save().then(savedUser => {
        res.json(savedUser)
    }).catch(err => {
      console.error(err);
        res.status(500).json("Server error");
    })
    
  }).catch(err => {
    console.error(err);
        res.status(500).json("Server error");
  })
  
});
router.get('/users', (req,res) => {
    User.find().then(result => {
        res.json(result);
    }).catch(err => {
        console.error(err);
        res.status(500).json("Server error");
    })
})
router.post('/add', (req,res) => {
    const {userId, description, duration, date} = req.body;
    User.findById(userId).then(user => {
        if(!user) return res.status(404).json("User doesn't exist");
        const newExercise = new Exercise({
            userId,
            description,
            duration,
            date: date ? date : new Date(),
        })
        newExercise.save().then(savedExercise => {
            res.json({
              _id: user._id,
              username: user.username,
              description: savedExercise.description,
              duration: savedExercise.duration,
              date: savedExercise.date
            })
        }).catch(err => {
            console.error(err);
            res.status(500).json("Server error")
        })
    })
})

router.get("/log/:userId", (req, res) => {
  const {userId} = req.params;
  
  
  User.findById(userId).then(user => {
    if (!user) return res.status(404).json("User doesn't exist");

    Exercise.find({userId}, 
      ["description", "duration", "date"], 
      {
        sort: {
          date: 1,
        }
      }).then(exercises => {
      const from = req.query.from ? new Date(req.query.from) : exercises[0].date;
      const to = req.query.to ? new Date(req.query.to) : exercises[exercises.length - 1].date;
      const limit = req.query.limit ? req.query.limit : exercises.length;
      const untilDate = exercises.filter(val => {
        const valDate = val.date;
        valDate.setUTCHours(0, 0, 0, 0);
        return valDate >= from && valDate <= to
      });
      const requsetedExerices = untilDate.slice(0,limit);
      res.json({
        user,
        log: requsetedExerices,
        count: requsetedExerices.length
      })
    })
  })
})

module.exports = router;