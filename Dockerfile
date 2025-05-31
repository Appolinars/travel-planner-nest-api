# Use an official lightweight Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Build the NestJS application
RUN npm run build

# ----------- Production Stage ------------
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Copy only the compiled output and package*.json from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Expose the port your NestJS listens on (e.g. 5000)
EXPOSE 5000

# Default command
CMD ["node", "dist/main.js"]