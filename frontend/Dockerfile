# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Copy the rest of the application source code and build
COPY . ./
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Copy the custom Nginx configuration.
# The nginx.conf file should be in the context root.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
