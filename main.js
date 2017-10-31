// Imports highest granularity of admin per country to a single psql database.
// node main.js -s gadm2-8 -l highest
const config = require('./config');
const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const bluebird = require('bluebird');
const exec = require('child_process').exec;
const database = config.pg_config.database;
const tables = config.pg_config.tables;

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Aggregate a csv of airport by admin 1 and 2'
});

parser.addArgument(
  ['-s', '--shapefile_source'],
  {help: 'Name of shapefile source: gadm2-8'}
);

parser.addArgument(
  ['-l', '--admin_level'],
  {help: 'Admin level: all or highest'}
);

const args = parser.parseArgs();
const shapefile_source = args.shapefile_source;
const admin_level_table = args.admin_level;
// Directory with shapefiles.
const shapefile_dir = config.shapefile_dir + shapefile_source;
const shapefile_directories = fs.readdirSync(shapefile_dir);

// Collect all directories with a country iso code like: AFG, ALA, BRA
// then create hash of country iso to file name of the shapefile with highest granularity
// { AFG: 'AFG_adm2.shp', ALA: 'ALA_adm1.shp', XAD: 'XAD_adm1.shp' }
const wanted_files = shapefile_directories.reduce(
  (h, dir) => {
    // iso is three letter country code
    let iso = dir.match(/^[A-Z]{3}/);
    if (iso) {
      iso = iso[0];
      h[iso] = fs.readdirSync(shapefile_dir + '/' + iso).filter( f => {
        return f.match('shp$');
      })
      .sort((a, b) => {
        // Sort shapefiles files by admin Level, highest first.
        let first = a.match(/\d/)[0];
        let second = b.match(/\d/)[0];
        return second - first;
      });
    }
    return h;
  },
  {})

// Iterate through country codes
// Importing the related shape file into postgres.
  bluebird.each(Object.keys(wanted_files), function(country, i) {
    return import_shapefiles(wanted_files[country]);
  }, {concurrency: 1})
  .catch(console.log)
  .then(function() {
    console.log('Done with import of admins.');
    process.exit();
  });

/**
 * Verifies if user has required level of authorisation
 * @param  {array} files file
 * @return {Promise} when shapefile has been imported
 */
function import_shapefiles(files) {
  console.log(files);
  if (admin_level_table.match(/highest/)) {
    files = files.slice(0, 1);
  }
  return new Promise((resolve, reject) => {
    bluebird.each(files, file => {
      return import_admins(file);
    }, {concurrency: 1})
    .then(resolve)
  });
}

/**
 * Verifies if user has required level of authorisation
 * @param  {string} file file
 * @return {Promise} when shapefile has been imported
 */
function import_admins(file) {
  return new Promise((resolve, reject) => {
    let admin_level = file.match(/\d/)[0];
    country = file.match(/[A-Z]{3}/)[0];
    // country_shapefiles afg_2_gadm2-8 ./data/shapefiles/gadm2-8/AFG/AFG_adm2.shp
    let command = 'bash lib/create_db_and_table.sh ' +
    database +
    ' ' +
    tables[admin_level_table] +
    ' ' +
    country.toLowerCase() +
    '_' +
    admin_level +
    '_gadm2-8 ' +
    shapefile_dir + '/' + country + '/' + file;

    exec(command, {maxBuffer: 2048 * 2500}, (err, stdout, stderr) => {
      if (err) {
        console.error(err);

        return reject(err);
      }

      resolve();
      console.log(stdout);
    });
  })
}
