const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  if (req.path.includes('user-progress')) console.log(`[ROUTE_CHECK] Hit ${req.method} ${req.path}`);
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebuddy')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const practiceRoutes = require('./routes/practice');
const progressRoutes = require('./routes/progress');
const roadmapRoutes = require('./routes/roadmap');
const aiRoutes = require('./routes/ai');
const testRoutes = require('./routes/tests');
const analyticsRoutes = require('./routes/analytics');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const communityRoutes = require('./routes/community');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const executeRoutes = require('./routes/execute');
const validateRoutes = require('./routes/validate');
const userProgressRoutes = require('./routes/userProgress');

// Auth Middleware
const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/execute', authMiddleware, executeRoutes);
app.use('/api/validate', authMiddleware, validateRoutes);
app.use('/api/user-progress', authMiddleware, userProgressRoutes);

// Protected Routes
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/roadmap', authMiddleware, roadmapRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/tests', authMiddleware, testRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/community', authMiddleware, communityRoutes);

app.get('/', (req, res) => {
  res.send('CodeBuddy Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
