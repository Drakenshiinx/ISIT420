var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const PetItems = require("../PetItems");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 "mongodb+srv://ISIT420User:ISIT420User@tiffcluster.5aju4.mongodb.net/PetItems?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all PetItems */
router.get('/PetItems', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  PetItems.find({}, (err, AllPetItems) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllPetItems);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewPetItem', function(req, res) {

    let oneNewPetItem = new PetItems(req.body);  // call constuctor in PetItems code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewPetItem.save((err, MyPetItem) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(MyPetItem);
      res.status(201).json(MyPetItem);
      }
    });
});


router.delete('/DeletePetItem/:id', function (req, res) {
  PetItems.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "ToDo successfully deleted" });
  });
});


router.put('/UpdatePetItem/:id', function (req, res) {
  PetItems.findOneAndUpdate(
    { _id: req.params.id },
    { title: req.body.title, petType: req.body.petType, priority: req.body.priority,   completed: req.body.completed },
   { new: true },
    (err, MyPetItem) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(MyPetItem);
    })
  });


  /* GET one PetItems */
router.get('/FindPetItem/:id', function(req, res) {
  console.log(req.params.id );
  PetItems.find({ _id: req.params.id }, (err, onePetItem) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(onePetItem);
  });
});

module.exports = router;
