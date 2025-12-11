# Backend API - Casandra's Client Keeper

RESTful API server for managing customers, dogs, appointments, and user authentication for a pet grooming business.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or cloud instance like MongoDB Atlas)
- Google OAuth credentials

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/casandras-client-keeper

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URLs (for CORS and redirects)
FRONTEND_URL=http://localhost:8081
MOBILE_REDIRECT_URI=casandras://auth/callback
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Interactive Documentation (Swagger UI)

Once the server is running, visit:
- **Swagger UI:** http://localhost:3000/api-docs

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive "Try it out" functionality
- Authentication testing

### OpenAPI Specification

The complete OpenAPI 3.0 specification is available in [swagger.yaml](swagger.yaml).

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication via Google OAuth.

### Authentication Flow

1. Client initiates OAuth: `GET /api/auth/google`
2. User authenticates with Google
3. Backend receives OAuth callback: `GET /api/auth/google/callback`
4. Backend generates JWT token
5. Token is set as HTTP-only cookie
6. Client redirected with token

### Using Bearer Token

For API requests, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/customers
```

## 📋 API Endpoints Overview

### Health & Status
- `GET /` - Welcome message with API documentation link
- `GET /health` - Health check endpoint

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback handler

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/oauth/:oauthId` - Get user by OAuth ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/search?name=...` - Search customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Dogs
- `GET /api/dogs` - Get all dogs
- `GET /api/dogs/:id` - Get dog by ID
- `GET /api/dogs/owner/:ownerId` - Get dogs by owner (customer)
- `GET /api/dogs/search?name=...` - Search dogs
- `POST /api/dogs` - Create new dog
- `PUT /api/dogs/:id` - Update dog
- `DELETE /api/dogs/:id` - Delete dog

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/customer/:customerId` - Get by customer
- `GET /api/appointments/dog/:dogId` - Get by dog
- `GET /api/appointments/range?startDate=...&endDate=...` - Get by date range
- `GET /api/appointments/status/:status` - Get by status
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment (soft delete)
- `DELETE /api/appointments/:id` - Delete appointment (hard delete)

### Statistics
- `GET /api/stats/dashboard` - Dashboard statistics
- `GET /api/stats/appointments` - Appointment statistics

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String,
  phone: String,
  oauthProvider: String (google|facebook|apple),
  oauthId: String,
  avatarUrl: String,
  role: String (admin|customer)
}
```

### Customer
```javascript
{
  name: String (required),
  phone: String (required),
  email: String,
  address: String,
  notes: String,
  userId: ObjectId (ref: User)
}
```

### Dog
```javascript
{
  name: String (required),
  breed: String (required),
  weight: Number,
  age: Number,
  temperament: [String],
  specialNotes: String,
  owner: ObjectId (ref: Customer, required)
}
```

### Appointment
```javascript
{
  customer: ObjectId (ref: Customer, required),
  dog: ObjectId (ref: Dog, required),
  dateTime: Date (required),
  duration: Number (default: 60),
  service: String (required),
  price: Number,
  status: String (pending|confirmed|completed|cancelled),
  paymentStatus: String (unpaid|paid|refunded),
  notes: String
}
```

## 🛠️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── googleAuth.js       # Google OAuth configuration
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── customerController.js
│   │   ├── dogController.js
│   │   ├── statsController.js
│   │   └── userController.js
│   ├── db/
│   │   └── connectDB.js        # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Customer.js
│   │   ├── Dog.js
│   │   └── User.js
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── dogRoutes.js
│   │   ├── statsRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   └── validateEnv.js      # Environment validation
│   └── server.js               # Main application entry
├── logs/                        # Application logs
├── swagger.yaml                 # OpenAPI specification
├── package.json
├── render.yaml                  # Render.com deployment config
└── README.md
```

## 📝 Logging

The application uses Winston for logging:
- Console output in development
- File logging in `logs/` directory
- HTTP request logging via Morgan

Log files:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## 🧪 Testing

### Manual Testing via Swagger UI

1. Start the server: `npm start`
2. Visit http://localhost:3000/api-docs
3. Click "Authorize" and enter your JWT token
4. Use "Try it out" on any endpoint

### Postman Collection

A Postman collection is available: [Casandra's Client Keeper.postman_collection.json](Casandra's%20Client%20Keeper.postman_collection.json)

Import it into Postman and configure these environment variables:
- `BASE_URL` - http://localhost:3000
- `BEARER_TOKEN` - Your JWT token
- `USERS_API` - /api/users
- `CUSTOMERS_API` - /api/customers
- `DOGS_API` - /api/dogs
- `APPOINTMENTS_API` - /api/appointments
- `STATS_API` - /api/stats

## 🚀 Deployment

### Render.com

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure environment variables
4. Deploy!

### Environment Variables (Production)

Ensure these are set in your production environment:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key for JWT signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Your production callback URL
- `FRONTEND_URL` - Your production frontend URL

## 🔧 Development

### Adding a New Endpoint

1. **Create/Update Controller** (`src/controllers/`)
   ```javascript
   exports.myNewEndpoint = async (req, res) => {
     try {
       // Your logic here
       res.json({ success: true, data: result });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   };
   ```

2. **Add Route** (`src/routes/`)
   ```javascript
   router.get('/my-endpoint', myNewEndpoint);
   ```

3. **Update Swagger Documentation** (`swagger.yaml`)
   ```yaml
   /api/my-endpoint:
     get:
       summary: My new endpoint
       tags:
         - MyTag
       responses:
         '200':
           description: Success
   ```

### Code Style

- Use async/await for asynchronous operations
- Follow RESTful conventions
- Return consistent JSON response format: `{ success: boolean, data: any }`
- Use appropriate HTTP status codes
- Add JSDoc comments for complex functions

## 📦 Dependencies

### Production
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **passport** / **passport-google-oauth20** - Authentication
- **jsonwebtoken** - JWT token generation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **winston** - Logging
- **morgan** - HTTP request logging
- **swagger-ui-express** - API documentation UI
- **yamljs** - YAML parsing for Swagger spec

### Development
- **nodemon** - Auto-reload during development

## 🐛 Troubleshooting

### Cannot connect to MongoDB
- Ensure MongoDB is running: `mongod`
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Google OAuth not working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check authorized redirect URIs in Google Cloud Console
- Ensure `GOOGLE_CALLBACK_URL` matches your configuration

### CORS errors
- Check `FRONTEND_URL` in `.env`
- Ensure your frontend URL is in the `allowedOrigins` array in `server.js`

### Port already in use
- Change `PORT` in `.env`
- Or kill the process using port 3000: `npx kill-port 3000`

## 📄 License

MIT License - See root README for details.

## 👤 Author

Justin Kaulback - [@JKaulback](https://github.com/JKaulback)
