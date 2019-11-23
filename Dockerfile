FROM node:12-alpine

ARG NODE=development
RUN echo "ARGS is ${NODE}"
ENV NODE_ENV ${NODE}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
