# frontend/Dockerfile
# This Dockerfile assumes that the 'build' directory with static assets
# has been created beforehand (e.g., in a CI/CD build step).
FROM nginx:alpine

# Copy the pre-built React application to Nginx's web root directory.
# The 'build' directory should be in the context root when 'docker build' is run.
COPY build/ /usr/share/nginx/html

# Copy the custom Nginx configuration.
# The nginx.conf file should be in the context root.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
