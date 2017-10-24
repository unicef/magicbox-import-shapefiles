// Imports highest granularity of admin per country to a single psql database.
// node main.js -s gadm2-8
var config = require('./config');
var ArgumentParser = require('argparse').ArgumentParser;
var fs = require('fs');
var bluebird = require('bluebird');
var exec = require('child_process').exec;
var database = config.pg_config.database_all_counties_one_table;

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Aggregate a csv of airport by admin 1 and 2'
});

parser.addArgument(
  ['-s', '--shapefile_source'],
  {help: 'Name of shapefile source: gadm2-8'}
);

var args = parser.parseArgs();
var shapefile_source = args.shapefile_source;
// Directory with shapefiles.
var shapefiles_dir = config.shapefile_dir + shapefile_source;
var shapefile_directories = fs.readdirSync(shapefiles_dir);

// Collect all directories with a country iso code like: AFG, ALA, BRA
// then create hash of country iso to file name of the shapefile with highest granularity
// { AFG: 'AFG_adm2.shp', ALA: 'ALA_adm1.shp', XAD: 'XAD_adm1.shp' }
var wanted_files = shapefile_directories.reduce(
  (h, dir) => {

    // iso is three letter country code
    var iso = dir.match(/^[A-Z]{3}/);
    if (iso) {
      iso = iso[0];
      h[iso] = fs.readdirSync(shapefiles_dir + '/' + iso).filter( f => {
        return f.match('shp$');
      }).sort((a, b) => {
        // Sort shapefiles files by admin Level, highest first.
        var first = a.match(/\d/)[0];
        var second = b.match(/\d/)[0];
        return second - first;
      })[0];
    }
    return h;},
  {})

// Iterate through country codes
// Importing the related shape file into postgres.
  bluebird.each(Object.keys(wanted_files), function(country, i) {
    return import_admins(country, wanted_files[country]);
  }, {concurrency: 1})
  .catch(console.log)
  .then(function() {
    console.log('Done with import of admins.');
    process.exit();
  });

function import_admins(country, file) {
  return new Promise((resolve, reject) => {
    var admin_level = file.match(/\d/)[0];
    var country = file.match(/[A-Z]{3}/)[0];


    var command = 'bash lib/create_db_all_countries_one_table.sh ' +
    database +
    ' ' +
    country.toLowerCase() +
    '_' +
    admin_level +
    '_gadm2-8 ' +
    shapefiles_dir + '/' + country + '/' + file;
    console.log(command);

    exec(command,{maxBuffer: 2048 * 2500}, (err, stdout, stderr) => {
      if (err) {
        console.error(err);

        return reject(err);
      }

      resolve();
      console.log(stdout);
    });
  });
}
