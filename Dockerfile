FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js ./
COPY lib/ ./lib/
COPY routes/ ./routes/
COPY middleware/ ./middleware/

EXPOSE 3001

CMD ["node", "server.js"]
