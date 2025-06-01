###############
# 1) Builder
###############
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Skip puppeteer’s built-in Chrome download
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 1a) Install dependencies exactly
COPY package*.json ./
RUN npm ci

# 1b) Copy code and build
COPY . .
RUN npm run build


###############
# 2) Runner
###############
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Install system Chrome so Puppeteer can run headlessly
RUN apk add --no-cache chromium

# Copy compiled output & lockfile
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Tell Puppeteer where Chrome lives
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000
CMD ["node", "dist/main.js"]