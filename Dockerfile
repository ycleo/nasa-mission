FROM node:lts-alpine 

WORKDIR /app
# only COPY package.json file to WORKDIR (/app)
COPY package*.json ./

# only COPY package.json file in the client folder to the client folder of the image
COPY client/package*.json client/
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000