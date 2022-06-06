FROM node

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "run", "start" ]