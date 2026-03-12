# Dis-moi papa - Plateforme de vente de livres en ligne
# Étape 1 : build de l'application React
FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des dépendances
# Utilisation de npm install au lieu de npm ci pour résoudre les conflits de versions
RUN npm install --legacy-peer-deps

# Copie du code source
COPY . .

# Build de production (Create React App)
RUN npm run build

# Étape 2 : serveur nginx pour servir les fichiers statiques
FROM nginx:alpine

LABEL org.opencontainers.image.title="Dis-moi papa"

# Port exposé (comme demandé)
EXPOSE 5173

# Suppression de la config nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Configuration nginx : écoute sur le port 5173 et support du routing SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
