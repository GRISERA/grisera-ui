FROM node:19.4.0-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install --quiet

COPY . /app

VOLUME ["/app/node_modules"]

CMD ["npm", "run", "serve"]
