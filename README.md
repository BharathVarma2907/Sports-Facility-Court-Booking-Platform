# Sports Court Booking Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for booking sports courts with dynamic pricing, multi-resource availability checking, and comprehensive admin management.

## 🚀 Features

### User Features
- **Authentication**: JWT-based secure login and registration
- **Court Browsing**: View available courts with filters (type, sport)
- **Real-time Booking**: 
  - Select date and time slots
  - Add optional coach
  - Add optional equipment
  - Real-time availability checking
  - Dynamic price calculation
- **Booking Management**: View and cancel bookings
- **Pricing Transparency**: Detailed price breakdown showing all fees

### Admin Features
- **Dashboard**: Overview with key metrics
- **Court Management**: CRUD operations for courts
- **Coach Management**: Manage coaches and their availability
- **Equipment Management**: Track equipment inventory
- **Pricing Rules**: Configure dynamic pricing (peak hours, weekends, holidays, indoor premium)
- **Booking Oversight**: View all bookings with filtering

### Technical Features
- **Multi-Resource Availability**: Simultaneous checking of court, coach, and equipment availability
- **Dynamic Pricing Engine**: Automatic calculation based on:
  - Base price
  - Peak hour surcharge (configurable hours)
  - Weekend multiplier
  - Holiday pricing
  - Indoor court premium
  - Coach fees
  - Equipment rental fees
- **Role-Based Access Control**: Admin and User roles
- **Refresh Token Rotation**: Secure token management
- **HttpOnly Cookies**: Enhanced security
- **Responsive Design**: Mobile-first Tailwind CSS
- **Toast Notifications**: Real-time feedback
- **Error Handling**: Comprehensive error boundaries

## 📁 Project Structure

```
/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── bookingController.js   # Booking operations
│   │   ├── coachController.js     # Coach management
│   │   ├── courtController.js     # Court management
│   │   ├── equipmentController.js # Equipment management
│   │   └── pricingRuleController.js # Pricing rules
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── errorHandler.js        # Error handling
│   ├── models/
│   │   ├── Booking.js             # Booking schema
│   │   ├── Coach.js               # Coach schema
│   │   ├── Court.js               # Court schema
│   │   ├── Equipment.js           # Equipment schema
│   │   ├── PricingRule.js         # Pricing rule schema
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── coachRoutes.js
│   │   ├── courtRoutes.js
│   │   ├── equipmentRoutes.js
│   │   └── pricingRuleRoutes.js
│   ├── utils/
│   │   ├── availabilityChecker.js # Availability logic
│   │   ├── jwt.js                 # Token utilities
│   │   └── pricingEngine.js       # Pricing calculations
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CourtCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingSuccess.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js             # API integration
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sports-booking
JWT_ACCESS_SECRET=your_access_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_here_change_in_production
JWT_ACCESS_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
ADMIN_EMAIL=admin@sportsbooking.com
ADMIN_PASSWORD=Admin@123
```

5. Start MongoDB (if local):
```powershell
mongod
```

6. Start backend server:
```powershell
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. Configure environment variables (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start development server:
```powershell
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Setup

### Create Admin User

After starting the backend, create an admin user:

```javascript
// Use MongoDB Compass or mongo shell
use sports-booking;

db.users.insertOne({
  name: "Admin",
  email: "admin@sportsbooking.com",
  password: "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa", // Admin@123
  role: "admin",
  phone: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Sample Data

Create sample courts:
```javascript
db.courts.insertMany([
  {
    name: "Tennis Court 1",
    type: "outdoor",
    sport: "Tennis",
    basePrice: 30,
    description: "Professional outdoor tennis court",
    capacity: 4,
    amenities: ["Lighting", "Net", "Seating"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Basketball Court Indoor",
    type: "indoor",
    sport: "Basketball",
    basePrice: 50,
    description: "Indoor basketball court with AC",
    capacity: 10,
    amenities: ["AC", "Scoreboard", "Locker Room"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

Create sample pricing rules:
```javascript
db.pricingrules.insertMany([
  {
    name: "Peak Hours",
    type: "peak_hour",
    multiplier: 1.5,
    description: "Evening peak hours surcharge",
    conditions: {
      startHour: 17,
      endHour: 21
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Weekend Surcharge",
    type: "weekend",
    multiplier: 1.3,
    description: "Weekend pricing",
    conditions: {
      days: ["Saturday", "Sunday"]
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Indoor Premium",
    type: "indoor_premium",
    multiplier: 1.2,
    description: "Indoor court premium",
    conditions: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login
```
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}
```

#### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer {token}
```

### Court Endpoints

#### Get All Courts
```
GET /courts?type=indoor&sport=Basketball&isActive=true
```

#### Get Court by ID
```
GET /courts/:id
```

#### Create Court (Admin)
```
POST /courts
Headers: Authorization: Bearer {token}
Body: {
  "name": "Court Name",
  "type": "indoor",
  "sport": "Basketball",
  "basePrice": 50,
  "description": "Description",
  "capacity": 10,
  "amenities": ["AC", "Lighting"]
}
```

#### Update Court (Admin)
```
PUT /courts/:id
Headers: Authorization: Bearer {token}
Body: { fields to update }
```

#### Delete Court (Admin)
```
DELETE /courts/:id
Headers: Authorization: Bearer {token}
```

### Booking Endpoints

#### Create Booking
```
POST /bookings
Headers: Authorization: Bearer {token}
Body: {
  "courtId": "court_id",
  "bookingDate": "2024-12-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "coachId": "coach_id" (optional),
  "equipmentList": [
    { "equipmentId": "equipment_id", "quantity": 2 }
  ],
  "notes": "Special requests"
}
```

#### Check Availability
```
POST /bookings/check-availability
Body: {
  "courtId": "court_id",
  "bookingDate": "2024-12-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "coachId": "coach_id" (optional),
  "equipmentList": []
}
```

#### Calculate Price
```
POST /bookings/calculate-price
Body: {
  "courtId": "court_id",
  "bookingDate": "2024-12-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "coachId": "coach_id" (optional),
  "equipmentList": []
}
```

#### Get User Bookings
```
GET /bookings/user/:userId
Headers: Authorization: Bearer {token}
```

#### Cancel Booking
```
PUT /bookings/:id/cancel
Headers: Authorization: Bearer {token}
```

### Similar endpoints exist for:
- **Coaches**: `/api/coaches`
- **Equipment**: `/api/equipment`
- **Pricing Rules**: `/api/pricing-rules`

## 🎨 Frontend Pages

### Public Pages
- `/` - Home (Court Listing)
- `/login` - Login Page
- `/register` - Registration Page

### User Pages (Protected)
- `/booking` - Booking Form
- `/booking-success` - Booking Confirmation
- `/my-bookings` - User's Bookings

### Admin Pages (Protected)
- `/admin` - Admin Dashboard

### Error Pages
- `*` - 404 Not Found

## 🔒 Security Features

1. **JWT Authentication**: Access and refresh token pattern
2. **HttpOnly Cookies**: Tokens stored securely
3. **Password Hashing**: bcrypt with salt rounds
4. **Role-Based Access**: Admin and user roles
5. **CORS Configuration**: Controlled origin access
6. **Input Validation**: Server-side validation
7. **Error Handling**: Sanitized error messages

## 🚀 Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add all from `.env`
5. Deploy

### Frontend Deployment (Netlify)

1. Create account on [Netlify](https://netlify.com)
2. Create new site from Git
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Add `_redirects` file in `public/`:
```
/* /index.html 200
```
5. Deploy

### MongoDB Atlas (Production Database)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for production)
5. Get connection string
6. Update `MONGODB_URI` in backend environment variables

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  phone: String,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Court
```javascript
{
  name: String,
  type: String (indoor/outdoor),
  sport: String,
  basePrice: Number,
  description: String,
  capacity: Number,
  amenities: [String],
  images: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  user: ObjectId (ref: User),
  court: ObjectId (ref: Court),
  bookingDate: Date,
  startTime: String,
  endTime: String,
  resources: {
    coach: ObjectId (ref: Coach),
    equipment: [{
      equipmentId: ObjectId (ref: Equipment),
      quantity: Number
    }]
  },
  pricingBreakdown: {
    basePrice: Number,
    peakHourFee: Number,
    weekendFee: Number,
    holidayFee: Number,
    indoorPremium: Number,
    coachFee: Number,
    equipmentFee: Number,
    total: Number,
    appliedRules: [String]
  },
  status: String (pending/confirmed/cancelled/completed),
  paymentStatus: String (pending/paid/refunded),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Admin Login
- Email: `admin@sportsbooking.com`
- Password: `Admin@123`

### Test User Registration
1. Go to `/register`
2. Create a new user account
3. Login with credentials
4. Browse and book courts

## 🎯 Key Algorithms

### Availability Checking
```javascript
// Checks simultaneously:
1. Court availability (no overlapping bookings)
2. Coach availability (if selected)
3. Equipment stock (if selected)
// Returns available only if ALL pass
```

### Dynamic Pricing
```javascript
// Calculates:
basePrice * duration
+ peakHourFee (if applicable)
+ weekendFee (if applicable)
+ holidayFee (if applicable)
+ indoorPremium (if indoor court)
+ coachFee (if coach selected)
+ equipmentFee (if equipment selected)
= Total Price
```

## 📝 Admin Credentials

**Email**: admin@sportsbooking.com  
**Password**: Admin@123

## 🤝 Contributing

This is a complete project template. To extend:

1. Add payment integration (Stripe/PayPal)
2. Add email notifications
3. Add review/rating system
4. Add real-time chat support
5. Add analytics dashboard
6. Add mobile app (React Native)

## 📄 License

MIT License - Feel free to use for learning and projects

## 👨‍💻 Author

Created as a full-stack MERN application demonstration

## 🐛 Known Issues & Future Improvements

1. Payment integration pending
2. Email notifications not implemented
3. Image upload functionality to be added
4. Advanced reporting features pending
5. Mobile app version planned

## 📞 Support

For issues and questions:
- Check documentation above
- Review API endpoints
- Check console errors
- Verify environment variables

---

**Built with**: MongoDB, Express.js, React, Node.js, Tailwind CSS, Vite
