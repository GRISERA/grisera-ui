#!/bin/sh

npm run build &
pid=$!
sleep 90
kill -9 $pid
#this file needs to have linux file end (LF) or it wont work