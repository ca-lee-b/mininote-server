FROM node:18-alpine as base 

WORKDIR /server 

COPY package*.json ./
RUN npm ci

COPY . ./

FROM base as production

RUN npx prisma generate
RUN npm run build