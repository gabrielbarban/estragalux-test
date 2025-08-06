# Condominium Manager Frontend

A modern React frontend for the Condominium Management System built with TypeScript, Material-UI, and Apollo Client.

## Features

- **Dashboard**: Overview with statistics and charts
- **Apartment Owners**: Full CRUD operations
- **Payments**: Payment management with filtering
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: GraphQL subscriptions for live data
- **Modern UI**: Material-UI components with beautiful design

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Apollo Client** for GraphQL
- **React Router** for navigation
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- Node.js 16 or higher
- Backend API running on `http://localhost:4000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.tsx        # Dashboard with charts
│   │   ├── ApartmentOwners.tsx # Apartment owners management
│   │   └── Payments.tsx        # Payments management
│   ├── App.tsx                 # Main app component
│   └── index.tsx               # Entry point
├── package.json
└── tsconfig.json
```

## Pages

### Dashboard
- Overview statistics (total owners, payments, amounts)
- Monthly payment charts
- Payment status breakdown
- Real-time data from GraphQL

### Apartment Owners
- List all apartment owners in cards
- Add new apartment owners
- Edit existing owners
- Delete owners with confirmation
- Form validation

### Payments
- List all payments with filtering
- Add new payments (linked to apartment owners)
- Edit payment details and status
- Delete payments with confirmation
- Status-based filtering (paid, pending, overdue)

## GraphQL Integration

The frontend uses Apollo Client to communicate with the GraphQL API:

- **Queries**: Fetch apartment owners and payments
- **Mutations**: Create, update, and delete operations
- **Real-time updates**: Automatic refetch after mutations
- **Error handling**: User-friendly error messages

## Styling

- **Material-UI Theme**: Custom theme with primary/secondary colors
- **Responsive Grid**: Adapts to different screen sizes
- **Cards Layout**: Clean card-based design for data display
- **Icons**: Material Design icons throughout the app

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Environment Variables

The frontend is configured to proxy requests to `http://localhost:4000` (the backend API).

## Deployment

The frontend can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service

### Docker Deployment

You can also run the frontend in Docker:

```bash
# Build the image
docker build -t condominium-frontend .

# Run the container
docker run -p 3000:3000 condominium-frontend
```

## API Endpoints

The frontend connects to these GraphQL endpoints:

- `GET /graphql` - All GraphQL operations
- `GET /health` - Health check

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request 