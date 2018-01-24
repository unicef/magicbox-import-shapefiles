magicbox-import-shapefiles
==========================

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

**Component of [MagicBox](https://github.com/unicef/magicbox)**


## About

This repo takes unzipped shapefiles and imports them into a PostgreSQL database.
It creates the database and one table (both named `all_countries_one_table`) and
appends the highest admin level shapefile per country to the table.


## Installation

Use [Docker](https://www.docker.com/) to build this image and run the
downloader. These steps assume you have a working Docker installation. If not,
review the Docker documentation first.

* [Docker - Installation](https://docs.docker.com/engine/installation/)
* [Docker - Getting started](https://docs.docker.com/get-started/)

### Build image, import volume

Build this image locally on your machine with this command.

```bash
docker build -t unicef/import-shapefiles .
```

This builds the Docker image locally on your machine.

You need to already have the unzipped shapefiles for this to work correctly.
Specify the location of the unzipped shapefiles in the config file. If you used
[magicbox-download-shapefiles](https://github.com/unicef/magicbox-download-shapefiles)
to get shapefiles, make sure you have the Docker volume on your system.

```bash
docker volume ls | grep -i 'shapefile_dbvolume'
```

### Run image

Now you can run the image. Start up the image with this command (it will use the
volume we created in the previous step to hold the data).

```bash
docker run --rm -it -v shapefile_dbvolume:/app/magicbox-download-shapefiles/data:z unicef/import-shapefiles
```


## Legal

[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

This project is licensed under the [BSD 3-Clause
License](https://opensource.org/licenses/BSD-3-Clause).
