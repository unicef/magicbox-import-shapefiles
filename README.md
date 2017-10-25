## Import shapefiles to postgres
#### This is a component of [Magic Box](https://github.com/unicef/magicbox/wiki)

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
    cp config-sample.js config.js
    node main.js -s gadm2-8
