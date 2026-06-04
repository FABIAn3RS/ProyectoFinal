# Etapa 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con serve
FROM node:20-alpine
RUN npm install -g serve
COPY --from=build /app/dist/VER0.5/browser /app
EXPOSE 8080
CMD ["serve", "-s", "/app", "-l", "8080"]
