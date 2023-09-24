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
RUN npm run generate


# Production stage
FROM nginx:latest AS production-stage

# Set working directory
RUN mkdir /app

# Copy build from build-stage
COPY --from=build-stage /usr/src/app/dist /app/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf