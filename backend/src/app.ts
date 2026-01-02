import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error';

// Routes
import hazardRoutes from './routes/hazards';
import alertRoutes from './routes/alerts';
import userRoutes from './routes/user';
import contentRoutes from './routes/content';
import drillRoutes from './routes/drills';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routing
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/hazards', hazardRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/drills', drillRoutes);

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`[server]: AlertWise Backend is running at http://localhost:${port}`);
});

export default app;
