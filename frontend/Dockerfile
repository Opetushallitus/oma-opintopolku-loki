FROM node:10.10-slim
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
ENTRYPOINT ["npm", "run"]
