# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /server

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the app dependencies
RUN npm install --production

# Copy the rest of the app's code into the working directory
COPY . .

# Set environment variables
ENV DB_URL="mongodb+srv://heetdhameliya59:Q2oxyqWW3M7DH5jr@cluster0.urfer.mongodb.net/digitalBusinessCard"

# Expose the port the app runs on
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
