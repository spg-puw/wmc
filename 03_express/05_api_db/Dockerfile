FROM node:19-alpine
WORKDIR /srv/nodejs/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 4000
CMD [ "node", "index.js" ]