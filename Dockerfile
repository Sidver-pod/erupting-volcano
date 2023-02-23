# Node.js image
FROM node:16

RUN mkdir /app

# setting up a directory in the image (all lines below this assume '/app' as the working directory)
WORKDIR /app

COPY package.json ./app

RUN npm install

# copying files from current directory into a directory named 'app' in the Docker image
COPY . . 

ENV PORT=3000

EXPOSE 3000

# executable command (starts the Server)
CMD [ "npm", "start" ]
