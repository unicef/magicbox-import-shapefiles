// This script returns an object with every column in every shapefile.
// Needed for creating a table in postgres for appending every shapefile.
// var readjson = require('readjson')
let shapefile_dir = require('../config').shapefile_dir;
let shapefile_set = 'gadm2-8'
const csvjson = require('csvjson');
let fs = require('fs');
const options = {
  delimiter: ',', // optional
  quote: '"' // optional
};


// // Scan each country shapeefile directory for highest admin level shapefile.
//  columns = fs.readdirSync('./data/' + shapefile_set).reduce((h, file) => {
//   // Not sure while geo props file is an array.
//   let fields = readjson.sync('./data/' + shapefile_set + '/' + file);
//   Object.keys(fields[0]).forEach(f => {
//     h[f] = h[f] ? h[f] + 1 : 1;
//   })
//   return h;
// }, {})


// Scan each country shapeefile directory for highest admin level shapefile.
let columns = fs.readdirSync(shapefile_dir + '/'
+ shapefile_set).reduce((h, dir) => {
  if (!dir.match(/[A-Z]{3}/)) {
    return h;
  }

  fs.readdirSync(shapefile_dir + shapefile_set + '/' + dir).forEach( file => {
    if (!file.match(/csv$/)) {
      return h
    }
    let csv = fs.readFileSync(shapefile_dir + shapefile_set +
    '/' + dir + '/' + file, {encoding: 'utf8'})
    let parsed = csvjson.toObject(csv, options);

    Object.keys(parsed[0]).forEach(f => {
      // gadm only uses the first 10 characters of the strings in the csv
      h[f.substring(0, 10)] = h[f] ? h[f] + 1 : 1;
    })
  });
  return h;
}, {})

 Object.assign(columns, {
   OBJECTID: 1,
   NAME_0: 1,
   NAME_1: 1,
   NAME_2: 1,
   NAME_3: 1,
   NAME_4: 1,
   NAME_5: 1,
   ID_0: 1,
   ID_1: 1,
   ID_2: 1,
   ID_3: 1,
   ID_4: 1,
   ID_5: 1})


   columns = Object.keys(columns).map(e => {
    return e + ' CHAR(150)'
  }).join(',')

console.log(columns)
