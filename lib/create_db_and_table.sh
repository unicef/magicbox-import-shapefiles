
#!/bin/bash

# Check if database exists...
if [ -z $(psql -lqt | cut -d \| -f 1 | grep $1) ]; then
	echo "Database doesn't exist, creating it now...$1"
	createdb $1
	psql $1 -c "CREATE EXTENSION postgis;"
fi


test_table_exists=`psql $1 -c "select * from pg_tables where schemaname='public'" | grep $2`

if [ "$test_table_exists" ]; then
  echo "Table exists $4 $2"
  shp2pgsql -s 4326 -a $4 $2 | psql $1
else
	echo "Start get columns..."
	columns=$(node './lib/get_all_geo_property_fields')
  echo "Table does NOT exist $columns"
	`psql $1 -c "CREATE TABLE $2
	(
	  gid serial NOT NULL PRIMARY KEY,
	  geom geometry(MultiPolygon,4326),
		$columns
	)
	;"`
  `psql $1 -c "CREATE INDEX ON $2 USING GIST (geom);"`
  `psql $1 -c "CREATE INDEX ON $2 (id_0);"`
  `psql $1 -c "CREATE INDEX ON $2 (id_1);"`
	`psql $1 -c "CREATE INDEX ON $2 (id_2);"`
  `psql $1 -c "CREATE INDEX ON $2 (id_3);"`
  `psql $1 -c "CREATE INDEX ON $2 (id_4);"`
  `psql $1 -c "CREATE INDEX ON $2 (id_5);"`
  `psql $1 -c "CREATE INDEX ON $2 (iso);"`
  shp2pgsql -s 4326 -a $4 $2 | psql $1
  # shp2pgsql -s 4326 -D -I $3 $1 | psql $1
fi
