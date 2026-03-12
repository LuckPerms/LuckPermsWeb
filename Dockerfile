# Build stage
FROM node:25-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git && npm install
COPY . .
COPY docker/config.json ./
RUN npm run build

# Run stage
FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80/tcp
