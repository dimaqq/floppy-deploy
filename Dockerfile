FROM node:18.17.1-alpine3.18

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json src .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
