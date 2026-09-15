FROM node:24-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553
WORKDIR /opt/app
COPY package*.json ./
RUN npm clean-install --ignore-scripts
COPY . .
ENTRYPOINT ["npm", "run"]
