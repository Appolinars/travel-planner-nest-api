# syntax=docker/dockerfile:1

##############
# BUILDER — installs all deps and compiles TypeScript -> dist
##############
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

##############
# RUNNER — production-only deps + compiled output
##############
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Compiled application
COPY --from=builder /usr/src/app/dist ./dist

# EJS templates + their assets are read at runtime from <cwd>/src/templates
# (see src/modules/pdf/pdf.service.ts), so they must ship in the image.
COPY --from=builder /usr/src/app/src/templates ./src/templates

EXPOSE 5000

# Run pending DB migrations, then start the API.
CMD ["npm", "run", "start:migrate:prod"]
