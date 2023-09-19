# Build stage
FROM node:latest AS build-stage

# Create app directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build app
RUN npm run build


# Production stage
FROM nginx:latest AS production-stage

# Set working directory
RUN mkdir /usr/src/app

# Copy build from build-stage
COPY --from=build-stage /usr/src/app/.nuxt/dist /usr/src/app/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf