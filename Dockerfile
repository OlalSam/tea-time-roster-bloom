# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all code
COPY . .

# 5. Expose your ports
EXPOSE 8080 8081

# 6. Default command: run server & dev
#    This matches your local: npm run server && npm run dev
CMD ["sh", "-c", "npm run server & npm run dev"]
