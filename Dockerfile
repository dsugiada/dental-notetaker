# Production
FROM node:18-alpine
WORKDIR /backend

# Copy the entire backend directory to avoid missing files
COPY backend/ /backend/

# Install dependencies
RUN npm install

# Build the application
RUN npm run build --verbose

EXPOSE 8080
CMD ["npm", "run", "prod"]
