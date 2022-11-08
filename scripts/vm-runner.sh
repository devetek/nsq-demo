#!/bin/bash

# Do not create worker like this will never return KRATOS-FINISHED in the end of process
# while true
# do
#   if [ `date +%H` -ge 17 ]; then
#     exit	# exit script
#   fi
#   pwd
#   echo "keep running"
#   sleep 5
# done

echo "[Progress] Preparing environment ..."
sleep 2
echo "[Progress] Cleaning unused code ..."
sleep 4
echo "[Progress] Install all dependencies ..."
sleep 2
echo "[Progress] Build service ....."
sleep 3
echo "[Progress] Packing docker or and debian package ..."
sleep 1
echo "[Progress] Upload assets ..."
sleep 3
echo "[Progress] Deploy ..."
sleep 2
echo "[Progress] Notification ..."

echo "KRATOS-FINISHED"
