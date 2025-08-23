FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npx -y playwright@1.49.1 install --with-deps

COPY . .

ENTRYPOINT ["npx", "playwright", "test"]
