FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run bundle

\
FROM builder AS test
RUN npm run test

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm prune --omit=dev && npm cache clean --force


EXPOSE 3000
CMD ["node", "--loader", "tsx", "src/main.ts"]


