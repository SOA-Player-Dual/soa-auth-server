# Build image
FROM node:16.13-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts --omit=dev
RUN npm rebuild bcrypt

COPY ./prisma prisma
COPY ./build build
COPY ./node_modules/.prisma node_modules/.prisma
COPY .env .
ENV HOST="0.0.0.0"
EXPOSE 8001
CMD ["npm", "start"]
