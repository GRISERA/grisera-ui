#!/bin/sh


ROOT_DIR=/usr/share/nginx/html


echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/*.js $ROOT_DIR/index.html;
do
  echo "Processing $file ...";
  sed -i 's|__VUE_APP_API_URL__|'"${VUE_APP_API_URL}"'|g' $file
  sed -i 's|__VUE_APP_AUTH_MS_URL__|'"${VUE_APP_AUTH_MS_URL}"'|g' $file
  sed -i 's|__VUE_APP_KEYCLOAK_URL__|'"${VUE_APP_KEYCLOAK_URL}"'|g' $file
  sed -i 's|__VUE_APP_KEYCLOAK_CLIENT_ID__|'"${VUE_APP_KEYCLOAK_CLIENT_ID}"'|g' $file
  sed -i 's|__VUE_APP_KEYCLOAK_REALM__|'"${VUE_APP_KEYCLOAK_REALM}"'|g' $file
done

echo "Finished replacing"

# Start Nginx
nginx -g 'daemon off;'