#!/bin/bash
if [ $UID -ne 0 ]; then
    echo 'run as root please'
    exit 1
fi

DB_HOST=`cat ../env.yaml | grep host: | awk -F: '{ print $2 }' | sed 's/^\s*//'`
DB_PORT=`cat ../env.yaml | grep port: | awk -F: '{ print $2 }' | sed 's/^\s*//'`
DB_USER=`cat ../env.yaml | grep username: | awk -F: '{ print $2 }' | sed 's/^\s*//'`
DB_PASS=`cat ../env.yaml | grep password: | awk -F: '{ print $2 }' | sed 's/^\s*//'`
DB_NAME=`cat ../env.yaml | grep db: | awk -F: '{ print $2 }' | sed 's/^\s*//'`



mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e"CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";

echo "Database <$DB_NAME> created!"

mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -e"source db_structure.sql";

echo 'Data structure created!'

mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -e"source db_data.sql";

echo 'Default data created!'

# update db to version 20220215
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -e"source db_update_20220215.sql";

echo 'Done!'

echo -e "\n\n\n"

echo '=== IMPORTANT NOTICE ==='
echo '1. Codefever community version is installed.'
echo '2. Type http://127.0.0.1 OR http://<server ip> to login.'
echo '3. Default login email: root@codefever.cn, password: 123456 .'
