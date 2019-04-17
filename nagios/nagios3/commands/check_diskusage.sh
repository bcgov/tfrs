PROJECT_NAME=$1

if ! (oc project -q $PROJECT_NAME > /dev/null); then
    echo "Could not select project $PROJECT_NAME"
    exit 2
fi

databasePodName=`oc get pods -n $PROJECT_NAME | grep postgresql96 | awk '{print $1}'`

backupDiskUsagePercent=`oc exec $databasePodName -c postgresql96 -n $PROJECT_NAME -- df -k | grep "/postgresql-backup" | awk '{print $5}'`
backupDiskUsage=${backupDiskUsagePercent%?}
diskusageAlarm=false
if [ ${backupDiskUsage} -gt 70 ]; then
        echo "The disk usage for /postgresql-backup is above 70%"
        diskusageAlarm=true
fi

databaseDiskUsagePercent=`oc exec $databasePodName -c postgresql96 -n $PROJECT_NAME -- df -k | grep "/var/lib/pgsql/data" | awk '{print $5}'`
databaseDiskUsage=${databaseDiskUsagePercent%?}
if [ ${databaseDiskUsage} -gt 70 ]; then
        echo "The disk usage for /var/lib/pgsql/data is above 70%"
        diskusageAlarm=true
fi
if [ ${diskusageAlarm} = true ]; then
        echo "CRITICAL - $1 disk usage checking failed"
        exit 2
fi
echo "OK - $1 disk usage checking passed successfully"
exit 0
