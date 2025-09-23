# -------- Stage 1: Build with Vite --------
FROM node:24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# FIX: Changed the source directory from /app/dist to /app/build
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]