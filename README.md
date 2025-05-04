# Tea Time Roster System

A modern employee roster management system built with React, Vite, and Node.js.

## Project Overview

This application helps manage employee rosters with features like:
- Employee management
- Roster scheduling
- Email notifications
- Real-time updates

## Tech Stack

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for authentication and database)

### Backend
- Node.js
- Express
- Nodemailer (for email notifications)

## Local Development

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Docker (optional, for containerized development)

### Environment Setup

1. Create a `.env` file in the root directory:
```env
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
PORT=8080
```

2. Install dependencies:
```sh
npm install
```

### Running Locally

#### Option 1: Using Docker Compose
```sh
docker-compose up
```
This will start:
- Vite dev server on port 8081
- Node.js server on port 8080

#### Option 2: Running Services Separately
```sh
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend dev server
npm run dev
```

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:

#### Environment Variables
```
NODE_ENV=production
PORT=10000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

#### Build & Deploy Settings
- **Dockerfile Path:** `./Dockerfile`
- **Docker Build Context Directory:** `.`
- **Auto-Deploy:** Enabled

The application will be automatically built and deployed using the Dockerfile configuration.

### Health Check

The application includes a health check endpoint at `/api/health` that returns:
- Server status
- Environment information
- Timestamp
- Port configuration

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── lib/              # Utility functions
├── server.js             # Backend server
├── Dockerfile            # Production Docker configuration
├── docker-compose.yml    # Development Docker configuration
└── vite.config.ts        # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
