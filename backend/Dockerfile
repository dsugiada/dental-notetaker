# Development
FROM node:18-alpine
WORKDIR /backend
COPY package*.json /backend/
RUN npm install --verbose
COPY . /backend/
EXPOSE 3001
CMD ["npm", "start"]
