FROM node:18-alpine
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Expose the port that Vite will use
ENV PORT=10000

# 4. Start both servers
CMD ["sh", "-c", "npm run server & npm run dev -- --host 0.0.0.0 --port $PORT"]

