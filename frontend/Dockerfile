FROM node:24-slim@sha256:03eae3ef7e88a9de535496fb488d67e02b9d96a063a8967bae657744ecd513f2
WORKDIR /opt/app
COPY package*.json ./
RUN npm clean-install --ignore-scripts
COPY . .
ENTRYPOINT ["npm", "run"]
