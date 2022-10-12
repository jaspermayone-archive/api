FROM node

# Create app directory
WORKDIR /app

COPY package.json ./
RUN yarn add pm2
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "run", "start" ]
