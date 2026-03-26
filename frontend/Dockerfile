FROM node:24-slim@sha256:06e5c9f86bfa0aaa7163cf37a5eaa8805f16b9acb48e3f85645b09d459fc2a9f
WORKDIR /opt/app
COPY package*.json ./
RUN npm clean-install --ignore-scripts
COPY . .
ENTRYPOINT ["npm", "run"]
