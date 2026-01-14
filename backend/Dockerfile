FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx playwright install-deps
RUN npx playwright install

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]