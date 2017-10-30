## Import shapefiles to postgres
#### This is a component of [Magic Box](https://github.com/unicef/magicbox/wiki)

Creates a database and table, both named all_countries_one_table, and appends the highest admin level shapefile per country to the table.

### Prerequisite
Prerequisite: [download_shapefiles_from_gadm](https://github.com/unicef/download_shapefiles_from_gadm/)

### Postgres
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    sudo apt-get install postgis*
    sudo -i -u postgres
    CREATE USER user_name SUPERUSER;

### Setup
    git clone git@github.com:unicef/import_shapefiles_to_postgres.git
    cd import_shapefiles_to_postgres
    npm install
    cp config-sample.js config.js
    node main.js -s gadm2-8
