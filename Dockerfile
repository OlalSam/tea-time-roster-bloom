FROM node:18-alpine
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Set build-time environment variables for Vite
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# 4. Build the Vite application
RUN npm run build

# 5. Start the server in production mode
ENV NODE_ENV=production
ENV PORT=10000

# 6. Start the server
CMD ["npm", "run", "server"]

