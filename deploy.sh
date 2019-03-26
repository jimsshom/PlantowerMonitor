#!/bin/bash
PI_IP='10.0.0.2'
PI_USER='pi'
PI_WORKDIR='~/PlantowerMonitor/'

FILE_LIST=('getInfo.py' 'main.py' 'plantower.cron')

for FILE in ${FILE_LIST[*]}
do
    scp $FILE $PI_USER@$PI_IP:$PI_WORKDIR
done
