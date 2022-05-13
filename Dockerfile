# Stage 1
FROM node:16-alpine as build_stage
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2
FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY --from=build_stage /usr/app/build ./build

EXPOSE ${PORT}
CMD npm start
