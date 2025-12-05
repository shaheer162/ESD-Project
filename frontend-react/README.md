# Sports Events System - React Frontend

This is the React frontend for the Sports Events System, converted from Angular.

## Features

- ⚽ Team registration and login
- 📊 Team dashboard with statistics
- 👥 Player management
- 📈 Match history and statistics
- 🏆 League standings
- 🎯 Top scorers and assists leaderboards

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend-react/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── pages/           # Page components
│   ├── services/         # API services
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the Spring Boot backend API at `http://localhost:8080/api/v1`.

All API services are defined in `src/services/api.ts` and organized by resource:
- `eventService` - Match/event operations
- `teamService` - Team operations
- `playerService` - Player operations
- `statisticsService` - Statistics and analytics
- `adminService` - Admin operations

## Authentication

Authentication is handled through the `AuthContext` which provides:
- Team login/register
- Admin login/register
- Session persistence via localStorage
- Protected routes

## Styling

The app uses Material-UI with a custom dark theme matching the original Angular design:
- Purple gradient primary color
- Dark background with glassmorphism effects
- Quicksand font family

## Development Notes

This is a work-in-progress conversion from Angular to React. Some components may still need to be implemented:
- Team dashboard components
- Statistics components
- List and item components
- Popup/dialog components

## License

Same as the main project.

