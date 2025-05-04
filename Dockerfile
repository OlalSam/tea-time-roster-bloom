FROM node:18-alpine
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Build the Vite application
RUN npm run build

# 4. Start the server in production mode
ENV NODE_ENV=production
ENV PORT=10000

# 5. Start the server
CMD ["npm", "run", "server"]

