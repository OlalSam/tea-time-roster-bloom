FROM node:18-alpine
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Expose no static port (optional)
#    Render will detect the port from the running process automatically
#    EXPOSE  # you can omit EXPOSE entirely, or document $PORT

# 4. Run both processes, binding Vite to $PORT
CMD ["sh", "-c", "npm run server & npm run dev -- --host 0.0.0.0 --port $PORT"]

