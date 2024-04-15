#!/bin/sh

npm run build &
pid=$!
sleep 90
kill -9 $pid
