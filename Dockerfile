FROM node:18-alpine
WORKDIR /
COPY . .
RUN npm install
RUN npm update
RUN npm install
CMD ["node", "index.js"]
EXPOSE 3000