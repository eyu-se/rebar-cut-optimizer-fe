# Build Stage
FROM oven/bun:1 as build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
# You can pass VITE_API_URL as an arg during build if needed
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

# Nginx Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Provide the Nginx proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
