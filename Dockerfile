# Use an official Node.js runtime as a parent image
FROM node:22.5.1

# Set the working directory in the container
WORKDIR /app

# Install foghorn globally
RUN npm install -g foghorn

# Set the entrypoint
ENTRYPOINT ["foghorn", "-u", "https://www.google.com", "-o", "/app/fogreport"]
