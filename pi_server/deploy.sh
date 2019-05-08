#!/bin/bash
PI_IP='10.0.0.7'
PI_USER='pi'
PI_WORKDIR='~/PlantowerMonitor/'

FILE_LIST=('getInfo.py' 'main.py' 'plantower.cron' 'webapi.py')

for FILE in ${FILE_LIST[*]}
do
    scp $FILE $PI_USER@$PI_IP:$PI_WORKDIR
done
