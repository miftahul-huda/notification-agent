# Use a slim Node.js base image to reduce size
FROM node:20-slim

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

RUN rm -rf node_modules

# Install dependencies
RUN npm install

# Rebuild sqlite3 (if necessary)
RUN npm rebuild sqlite3 

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application code
COPY . .

ENV APPLICATION_PORT=1415

# Expose the port your app listens on
EXPOSE 1415
EXPOSE 1416

# Define the command to start your app
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
