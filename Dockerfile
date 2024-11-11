# Etapa 1: Construcción
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar las dependencias (de forma rápida y segura)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Si tienes un paso de construcción (como TypeScript), descomenta la siguiente línea
RUN npm run build

# Etapa 2: Producción
FROM alpine:3.18

# Etiquetas
LABEL autor="Francisco Montés Doria"
LABEL maintainer="f.montesdoria@gmail.com"
LABEL version="1.0"
LABEL description="Docker image for Fastify backend EmpleaMe"
LABEL repository="https://github.com/2n-DAW/backend-proxy-fastify"
LABEL build-date="10-11-2024"

# Instalar Node.js
RUN apk add --update nodejs npm

WORKDIR /app

# Copiar archivos de dependencias
COPY --from=build /app/package*.json ./

# Instalar solo las dependencias de producción
RUN npm ci --only=production

# Copiar los archivos compilados
COPY --from=build /app/dist ./dist

# Definir las variables de entorno
ENV PORT=3003
ENV CORSURL=http://localhost:8080

# Exponer el puerto 3003
EXPOSE 3003

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]