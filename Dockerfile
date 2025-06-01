##############
# BUILDER
##############
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 1) Copy package manifests and install everything (incl. @nestjs/cli)
COPY package*.json ./
RUN npm install

# 2) Copy source and compile
COPY . .
RUN npm run build


##############
# RUNNER
##############
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# 3) Copy only built output + package.json
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# 4) Install production‐only deps (no devDeps)
RUN npm install --production

# 5) Expose the port your app actually uses
EXPOSE 5000

# 6) Start the compiled app
CMD ["node", "dist/main.js"]