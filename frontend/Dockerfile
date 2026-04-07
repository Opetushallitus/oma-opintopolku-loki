FROM node:24-slim@sha256:b506e7321f176aae77317f99d67a24b272c1f09f1d10f1761f2773447d8da26c
WORKDIR /opt/app
COPY package*.json ./
RUN npm clean-install --ignore-scripts
COPY . .
ENTRYPOINT ["npm", "run"]
