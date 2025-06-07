FROM node:18-alpine

WORKDIR /app

COPY ./react-app/package*.json ./
RUN npm install

COPY ./react-app .

EXPOSE 3000
CMD ["npm", "start"]