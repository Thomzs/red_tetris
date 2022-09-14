FROM node:18.1.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn config set "@bit:registry" "https://node.bit.cloud/"
RUN yarn add react-scripts --silent

COPY . ./

EXPOSE 3001
EXPOSE 8080

CMD ["node", "src/server.js"]