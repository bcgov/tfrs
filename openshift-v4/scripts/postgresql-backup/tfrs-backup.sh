#!/bin/bash
## $1 is release name, $2 is env name
current_time=`date +"20%y%m%d-%H%M%S"`
dump_name=`echo "tfrs-$2-${current_time}-before-apply-$1"`
echo "    Running full database backup"
pg_dump tfrs | gzip > /postgresql-backup/SQLDump/$2/${dump_name}.gz
sleep 20s

echo "    Running PINT database backup"

command_start_backup=`echo "psql tfrs -c \"SELECT pg_start_backup('${dump_name}')\""`
eval $command_start_backup

tar --warning=no-file-changed --warning=no-file-removed -cf /postgresql-backup/basebackup/$2/tfrs-$2-${current_time}-before-apply-$1.tar --absolute-names /var/lib/pgsql/data/userdata

sleep 30s
command_stop_backup=`echo "psql tfrs -c \"SELECT pg_stop_backup()\""`
eval $command_stop_backup