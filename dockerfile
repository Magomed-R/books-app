FROM node:22-alpine3.20

WORKDIR /app

COPY . /app/

RUN npm i

CMD npm run start:migrate:prod