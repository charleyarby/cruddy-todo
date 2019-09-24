const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');







var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, newId) => {
    let id = newId;
    //console.log(id, 'this is id');
    items[id] = text;
    console.log(text,' this is text');
    fs.writeFile(`./test/testData/${id}.txt`, text.toString(), function(err) {
      if (err) {
        throw err;
      }
    });
    callback(null, { id, text });
    //need to write new file for created toDo
  });



};

exports.readAll = (callback) => {
  //console.log(fs.readdirSync('./test/testData').length )
  if (fs.readdirSync('./test/testData').length === 0) {
    return [];
  }
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  console.log(id, 'this is id')
  console.log(item, 'text content')
  delete items[id];

  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.unlink(`./test/testData/${id}.txt`, (err) => {
      if (err) {
        throw err;
      }
    });
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
