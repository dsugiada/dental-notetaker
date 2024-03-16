# Production
FROM node:18-alpine
WORKDIR /backend
COPY backend/package*.json /backend/
RUN npm install
COPY backend/src /backend/src
COPY backend/webpack.config.js /backend/
RUN npm run build --verbose
EXPOSE 8080
CMD ["npm", "run", "prod"]
