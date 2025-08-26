import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

// ✅ Allow CORS (update frontend URL later)
app.use(cors({
    origin: "https://imagifyy-flax.vercel.app", // change to frontend URL after deploy
  credentials: true,
}));


connectDB();


app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
