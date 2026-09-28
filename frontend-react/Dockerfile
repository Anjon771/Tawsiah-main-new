# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Accept API URLs as build args
ARG REACT_APP_API_URL=http://localhost:8082
ARG REACT_APP_FASTAPI_URL=http://localhost:8000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_FASTAPI_URL=${REACT_APP_FASTAPI_URL}

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional, for React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
