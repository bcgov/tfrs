PROJECT_NAME=$1

databasePodName=`oc get pods -n $PROJECT_NAME | grep postgresql96 | awk '{print $1}'`

backupDiskUsagePercent=`oc exec $databasePodName -c postgresql96 -n $PROJECT_NAME -- df -k | grep "/postgresql-backup" | awk '{print $5}'`
backupDiskUsage=${backupDiskUsagePercent%?}
diskusageAlarm=false
if [ ${backupDiskUsage} -gt 70 ]; then
        diskusageAlarm=true
fi

databaseDiskUsagePercent=`oc exec $databasePodName -c postgresql96 -n $PROJECT_NAME -- df -k | grep "/var/lib/pgsql/data" | awk '{print $5}'`
databaseDiskUsage=${databaseDiskUsagePercent%?}
if [ ${databaseDiskUsage} -gt 70 ]; then
        diskusageAlarm=true
fi
if [ ${diskusageAlarm} = true ]; then
        echo "CRITICAL - $1 Posgresql liveness checking failed"
        exit 2
fi
echo "OK - $1 Posgresql liveness checking passed"
exit 0
