import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json()); // parse JSON body
app.use(cors());


connectDB();


app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Serve frontend in production

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve(); // required for ES modules
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
