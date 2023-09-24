FROM node:18-alpine as base 

WORKDIR /server 

FROM base as build
COPY package*.json ./
RUN npm ci

COPY . ./
RUN npx prisma generate
RUN npm run build

FROM base as production

COPY --from=build /server/build /server/build
COPY --from=build /server/node_modules /server/node_modules
COPY --from=build /server/prisma /server/prisma
COPY --from=build /server/.env* /server/

EXPOSE 8080
ENV PORT 8080
CMD ["node", "/server/build/index.js"]
# CMD ["startup.sh"]