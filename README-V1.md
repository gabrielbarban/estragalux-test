# Condominium Management App

A simple condominium management application built with Node.js 18, TypeScript, GraphQL, and MongoDB. This app allows you to manage apartment owners and their payments.

## Features

- **Apartment Owner Management**: Add, update, and delete apartment owners
- **Payment Management**: Track payments for each apartment owner
- **GraphQL API**: Modern API with queries and mutations
- **MongoDB Database**: NoSQL database for flexible data storage
- **React Frontend**: Modern, responsive web interface
- **Real-time Dashboard**: Statistics and charts for data visualization

## Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud instance)

## Installation

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd condominium-manager
```

2. Start the entire application with Docker Compose:
```bash
docker-compose up -d
```

This will start:
- **MongoDB** on port 27017
- **Node.js Backend** on port 4000
- **React Frontend** on port 3000
- **MongoDB Express** (Web UI) on port 8081

3. Access the application:
- **React Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **MongoDB Express**: http://localhost:8081
- **Health Check**: http://localhost:4000/health

### Option 2: Frontend Only

If you want to run just the frontend with an existing backend:

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

The React app will be available at http://localhost:3000

### Option 3: Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd condominium-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit the `.env` file with your MongoDB connection string:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/condominium-manager
NODE_ENV=development
```

4. Build the project:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:4000` and the GraphQL Playground will be available at `http://localhost:4000/graphql`.

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: Available at the same URL for testing queries

### Health Check
- **URL**: `http://localhost:4000/health`
- **Method**: GET

## GraphQL Queries and Mutations

### Apartment Owners

#### Get all apartment owners
```graphql
query {
  apartmentOwners {
    id
    name
    email
    apartmentNumber
    phoneNumber
    createdAt
    updatedAt
  }
}
```

#### Get apartment owner by ID
```graphql
query {
  apartmentOwner(id: "apartment-owner-id") {
    id
    name
    email
    apartmentNumber
    phoneNumber
  }
}
```

#### Create new apartment owner
```graphql
mutation {
  createApartmentOwner(input: {
    name: "John Doe"
    email: "john.doe@example.com"
    apartmentNumber: "A101"
    phoneNumber: "+1234567890"
  }) {
    id
    name
    email
    apartmentNumber
    phoneNumber
    createdAt
  }
}
```

#### Update apartment owner
```graphql
mutation {
  updateApartmentOwner(
    id: "apartment-owner-id"
    input: {
      name: "John Smith"
      phoneNumber: "+0987654321"
    }
  ) {
    id
    name
    email
    apartmentNumber
    phoneNumber
    updatedAt
  }
}
```

#### Delete apartment owner
```graphql
mutation {
  deleteApartmentOwner(id: "apartment-owner-id")
}
```

### Payments

#### Get all payments
```graphql
query {
  payments {
    id
    amount
    month
    description
    paymentDate
    status
    apartmentOwner {
      id
      name
      apartmentNumber
    }
  }
}
```

#### Get payments by apartment owner
```graphql
query {
  paymentsByApartmentOwner(apartmentOwnerId: "apartment-owner-id") {
    id
    amount
    month
    status
    paymentDate
  }
}
```

#### Create new payment
```graphql
mutation {
  createPayment(input: {
    apartmentOwnerId: "apartment-owner-id"
    amount: 500.00
    month: "2024-01"
    description: "Monthly maintenance fee"
    status: pending
  }) {
    id
    amount
    month
    description
    status
    paymentDate
  }
}
```

#### Update payment
```graphql
mutation {
  updatePayment(
    id: "payment-id"
    input: {
      status: paid
      description: "Paid via bank transfer"
    }
  ) {
    id
    amount
    month
    description
    status
    updatedAt
  }
}
```

#### Delete payment
```graphql
mutation {
  deletePayment(id: "payment-id")
}
```

## Data Models

### ApartmentOwner
- `id`: Unique identifier
- `name`: Owner's full name
- `email`: Email address (unique)
- `apartmentNumber`: Apartment number (unique)
- `phoneNumber`: Phone number (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Payment
- `id`: Unique identifier
- `apartmentOwnerId`: Reference to apartment owner
- `amount`: Payment amount
- `month`: Payment month (YYYY-MM format)
- `description`: Payment description (optional)
- `paymentDate`: Date when payment was made
- `status`: Payment status (pending, paid, overdue)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project for production
- `npm start`: Start production server
- `npm test`: Run tests

### Docker Commands

- `docker-compose up -d`: Start all services in background
- `docker-compose up`: Start all services with logs
- `docker-compose down`: Stop all services
- `docker-compose logs -f backend`: Follow backend logs
- `docker-compose logs -f frontend`: Follow frontend logs
- `docker-compose logs -f mongodb`: Follow MongoDB logs
- `docker-compose restart backend`: Restart only the backend
- `docker-compose restart frontend`: Restart only the frontend
- `docker-compose exec mongodb mongosh`: Access MongoDB shell

### Project Structure

```
src/
├── config/
│   └── database.ts          # Database connection
├── graphql/
│   ├── schema.ts            # GraphQL schema
│   └── resolvers.ts         # GraphQL resolvers
├── models/
│   ├── ApartmentOwner.ts    # Apartment owner model
│   └── Payment.ts           # Payment model
└── index.ts                 # Main server file

frontend/
├── src/
│   ├── components/
│   │   └── Layout.tsx       # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.tsx    # Dashboard with charts
│   │   ├── ApartmentOwners.tsx
│   │   └── Payments.tsx     # Payment management
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── public/
│   └── index.html           # HTML template
└── package.json             # Frontend dependencies

mongo-init/
└── init.js                  # MongoDB initialization script

Dockerfile                   # Backend Docker configuration
docker-compose.yml           # Docker Compose setup
.dockerignore               # Backend Docker ignore file

frontend/
├── src/
│   ├── components/
│   │   └── Layout.tsx       # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.tsx    # Dashboard with charts
│   │   ├── ApartmentOwners.tsx
│   │   └── Payments.tsx     # Payment management
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── public/
│   └── index.html           # HTML template
├── package.json             # Frontend dependencies
├── Dockerfile               # Frontend Docker configuration
└── .dockerignore           # Frontend Docker ignore file
```

## License

MIT 