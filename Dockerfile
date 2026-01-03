FROM node:18-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]
