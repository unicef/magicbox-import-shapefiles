// This script returns an object with every column in every shapefile.
// Needed for creating a table in postgres for appending every shapefile.

let shapefile_dir = require('../config').shapefile_dir;
let shapefile_set = 'gadm2-8'
var csvjson = require('csvjson');
let fs = require('fs');
var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};


// Scan each country shapeefile directory for highest admin level shapefile.
var columns = fs.readdirSync(shapefile_dir + '/' + shapefile_set).reduce((h, dir) => {
  if (!dir.match(/[A-Z]{3}/)) {
    return h;
  }

  fs.readdirSync(shapefile_dir + shapefile_set + '/' + dir).forEach( file => {
    if (!file.match(/csv$/)) {
      return h
    }
    var csv = fs.readFileSync(shapefile_dir + shapefile_set + '/' + dir + '/' + file,  { encoding : 'utf8'})
    var parsed = csvjson.toObject(csv, options);

    Object.keys(parsed[0]).forEach(f => {
      h[f] = h[f] ? h[f] + 1 : 1;
    })
  });
  return h;
}, {})

 Object.assign(columns, {ID_0: 1, ID_1: 1, ID_2: 1, ID_3: 1, ID_4: 1, ID_5: 1})


var columns = Object.keys(columns).map(e => {
    return e + " CHAR(150)"
  }).join(',')

console.log(columns)
