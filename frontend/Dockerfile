
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install lucide-react

EXPOSE 3001
CMD ["npm", "start"]
