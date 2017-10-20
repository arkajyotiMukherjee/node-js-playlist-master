var bodyParser= require('body-parser');
var mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://test:test@ds125365.mlab.com:25365/todo');

//Create a schema -this is like our blueprint

var todoSchema = new mongoose.Schema({
  item: String
});

//creating mondel

var Todo = mongoose.model('Todo',todoSchema);


//var data= [{item:'get milk'},{item: 'walk dog'},{item:'kick ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {

  app.get('/todo', function (req, res) {
    //get data from mongodb and pass to the view
    Todo.find({},function (err, data) {
      if (err) {
        throw err;
      }
      res.render('todo', {todos: data});
    });

  });

  app.post('/todo',urlencodedParser, function (req, res) {
    //get data from the view and add to mongodb
    var newTodo = Todo(req.body).save(function (err,data) {
      if (err) {
        throw err;
      }
      res.json(data);
    });

  });

  app.delete('/todo/:item', function (req, res) {

    //delete the requested item from mongobd
    //you made a typo in the word item and reviewed the code base for hours
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function (err, data) {
      if (err) {
        throw err;
      }
      res.render('todo', {todos: data});
    });

  });
};
