FROM node:18.1.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn config set "@bit:registry" "https://node.bit.cloud/"
RUN yarn add react-scripts --silent

# add app
COPY . ./

EXPOSE 3001
EXPOSE 3000

# start app
CMD ["npm", "start"]