FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY src/ ./src
COPY nest-cli.json .
COPY package-lock.json ./

RUN npm run build

CMD ["node", "dist/main.js"]

EXPOSE 3000