FROM node:18

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci

RUN npm run test

EXPOSE 3000


CMD ["npx", "tsx", "src/main.ts"]
