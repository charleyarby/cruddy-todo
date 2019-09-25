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
    //console.log(text,' this is text');
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text.toString(), function(err) {
      if (err) {
        throw err;
      } else {
        callback(null, { id, text });
      }
    });
    //need to write new file for created toDo
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('there was an error');
    } else {
      // console.log(items, ' this is item');
      // console.log(files, 'this is files');
      var promises = _.map(files, (file) => {
        let id = file.slice(0, file.indexOf('.'));
        return new Promise ((resolve, reject) => {
          exports.readOne(id, (err, todo) => {
            if (err) {
              reject(err);
            } else {
              resolve(todo);
            }
          });
        });
      });
      console.log(promises, 'this is promisesArray');
      let todoArr = Promise.all(promises).then((promisesArr) => {
        callback(null, promisesArr);
      });
    }
  });
};




// return { id, text: id };

exports.readOne = (id, callback) => {
  var text = items[id];

  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
    console.log(err);
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: data });
    }
  });



};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('there was an error');
      } else {
        items[id] = text;
        callback(null, { id, text });
      }
    });

  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  //console.log(id, 'this is id');
  //console.log(item, 'text content');
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
