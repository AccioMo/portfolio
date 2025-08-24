
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm install --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
