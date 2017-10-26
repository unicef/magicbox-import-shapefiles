
#!/bin/bash

# Check if database exists...
if [ -z $(psql -lqt | cut -d \| -f 1 | grep $1) ]; then
	echo "Database doesn't exist, creating it now...$1"
	createdb $1
	psql $1 -c "CREATE EXTENSION postgis;"
fi


test_table_exists=`psql $1 -c "select * from pg_tables where schemaname='public'" | grep $1`

if [ "$test_table_exists" ]; then
  echo "Table exists $1"
  shp2pgsql -s 4326 -a $3 $1| psql $1
else
	echo "Start get columns..."
	columns=$(node './lib/get_all_geo_property_fields')
  echo "Table does NOT exist"
	`psql $1 -c "CREATE TABLE $1
	(
	  gid serial NOT NULL PRIMARY KEY,
	  geom geometry(MultiPolygon,4326),
		$columns
	)
	;"`
  `psql $1 -c "CREATE INDEX ON $1 USING GIST (geom);"`

  shp2pgsql -s 4326 -a $3 $1| psql $1
  # shp2pgsql -s 4326 -D -I $3 $1 | psql $1
fi
