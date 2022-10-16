FROM node:bullseye
LABEL maintainer="Ashwin Singh >"
LABEL description="Heptagram-Project."

#Node env  
ENV NODE_ENV=development
#ENV NODE_ENV=production

ENV PORT=3000


# Create app directory
RUN mkdir /app
WORKDIR /app

#Nodejs bum and pm2(To use latter for scaling) install
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g pm2
RUN npm install -g ts-node
RUN curl https://bun.sh/install | bash

#setting bun env path
ENV PATH="/root/.bun/bin:$PATH"
COPY package.json /app/
COPY bun.lockb /app/

#without this error of husky not installed
RUN npm i husky --save-dev
RUN bun install

# Bundle app source
COPY . .
EXPOSE 3000

CMD [ "bun", "start" ]
