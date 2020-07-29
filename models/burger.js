// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var burger = {
  all: function(cb) {
    orm.select("burgers", function(res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(name, cb) {
    orm.create("burgers", 
    ["burger_name", "devoured"], 
    [name, false], 
    cb);
  },
  update: function(id, cb) {
    var condition = "id=" + id;

    orm.update("burgers", {
      devoured: true
    }, condition, cb);
  },
  delete: function(condition, cb) {
    orm.delete("burgers", condition, function(res) {
      cb(res);
    });
  }
};

// Export the database functions for the controller (catsController.js).
module.exports = burger;
