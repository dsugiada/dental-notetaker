# Production
FROM node:18-alpine
WORKDIR /backend

# Copy necessary files and directories
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/.env/.env.production ./.env/.env.production
COPY backend/.ssl ./.ssl
COPY backend/.jwt ./.jwt
COPY backend/pm2.config.json ./
COPY backend/src ./src
COPY backend/webpack.config.js ./

# Debugging: List the contents of the backend directory
RUN ls -la

# Install dependencies
RUN npm install

# Debugging: List the contents of the node_modules directory to confirm installation
RUN ls -la node_modules

# Build the application
RUN npm run build --verbose

EXPOSE 8080
CMD ["npm", "run", "prod"]
