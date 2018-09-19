FROM node:10.10-slim
RUN mkdir /opt/app
COPY package*.json /opt/app/
WORKDIR /opt/app
RUN npm install
COPY . /opt/app
ENTRYPOINT ["npm"]