## Import shapefiles to postgres
#### This is a component of Magic Box

### Set up
Prerequisite: (download_shapefiles_from_gadm)[https://github.com/unicef/download_shapefiles_from_gadm/]

### Postgres
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    sudo apt-get install postgis*
    sudo -i -u postgres
    CREATE USER user_name SUPERUSER;
