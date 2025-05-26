FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY src/ ./src
COPY nest-cli.json .
COPY package-lock.json ./

RUN apk add --no-cache openssl && \
    npm run build

CMD ["npm", "run", "start:prod"]

EXPOSE 3000