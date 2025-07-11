# Usa la imagen oficial de Node LTS
FROM node:22

# Crea el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Construye la app
RUN npm run build

# Expone el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "start:prod"]