#!/bin/sh


ROOT_DIR=/usr/share/nginx/html


echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i 's|process.env.VUE_APP_API_URL|'"${VUE_APP_API_URL}"'|g' $file
  sed -i 's|process.env.VUE_APP_AUTH_MS_URL|'"${VUE_APP_AUTH_MS_URL}"'|g' $file
done

echo "Finished replacing"

# Start Nginx
nginx -g 'daemon off;'