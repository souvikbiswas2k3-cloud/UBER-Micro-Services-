# Uber-like Microservices Application

A microservices-based ride-hailing application built with Node.js, Express, MongoDB, and RabbitMQ.

## Architecture

The application consists of four main services:

1. **API Gateway** (Port: 5000)
   - Routes requests to appropriate microservices
   - Handles service discovery and load balancing

2. **User Service** (Port: 5001)
   - Manages user authentication and profiles
   - Handles user registration, login, and session management

3. **Captain Service** (Port: 5002)
   - Manages driver (captain) profiles and availability
   - Handles ride acceptance and driver status

4. **Ride Service** (Port: 5003)
   - Manages ride creation and status
   - Coordinates between users and captains

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Message Queue**: RabbitMQ
- **Authentication**: JWT (JSON Web Tokens)
- **API Gateway**: Express HTTP Proxy

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ
- npm or yarn

## Environment Setup

Each service requires its own `.env` file. Use the `.env.Sample.txt` files as templates:

### User Service
```env
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://user:pass@localhost:27017/uber-user-service
RABBIT_URL=your_rabbitmq_url
```

### Captain Service
```env
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://user:pass@localhost:27017/uber-captain-service
RABBIT_URL=your_rabbitmq_url
```

### Ride Service
```env
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://user:pass@localhost:27017/uber-ride-service
BASE_URL=http://localhost:5000
RABBIT_URL=your_rabbitmq_url
```

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies for each service:
```bash
cd gateway && npm install
cd ../user && npm install
cd ../captain && npm install
cd ../ride && npm install
```

3. Start each service:
```bash
# Start API Gateway
cd gateway && node app.js

# Start User Service
cd user && node server.js

# Start Captain Service
cd captain && node server.js

# Start Ride Service
cd ride && node server.js
```

## API Endpoints

### User Service
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/logout` - User logout
- `GET /user/profile` - Get user profile
- `GET /user/accepted-ride` - Get accepted ride details

### Captain Service
- `POST /captain/register` - Register new captain
- `POST /captain/login` - Captain login
- `GET /captain/logout` - Captain logout
- `GET /captain/profile` - Get captain profile
- `PATCH /captain/toggle-availability` - Toggle captain availability
- `GET /captain/new-ride` - Wait for new ride requests

### Ride Service
- `POST /ride/create-ride` - Create new ride request
- `PUT /ride/accept-ride` - Accept ride request

## Message Queue Events

The application uses RabbitMQ for asynchronous communication between services:

- `new-ride` - Published when a new ride is created
- `ride-accepted` - Published when a captain accepts a ride

## Authentication

The application uses JWT for authentication. Tokens are stored in cookies and must be included in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

## Database Schema

### User Service
- User Model: username, email, password
- BlacklistToken Model: token, createdAt

### Captain Service
- Captain Model: name, email, password, isAvailable
- BlacklistToken Model: token, createdAt

### Ride Service
- Ride Model: captain, user, pickup, destination, status

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC