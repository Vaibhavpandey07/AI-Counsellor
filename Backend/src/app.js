import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import userOtherDetailsRouter from './routes/userOtherDetails.routes.js';
import userOnBoardingRouter from './routes/userOnBoarding.routes.js';
import universityRouter from './routes/university.routes.js';
import lockUniversityRouter from './routes/lockUniversity.routes.js';
import aiChatRouter from './routes/aiChat.routes.js';





import cookieParser from 'cookie-parser'
import errorMiddleware from './middleware/error.middleware.js';


 
dotenv.config({path:"./.env"})
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());

app.use(cors({
   origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials:true
}));


app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());



app.use('/public', express.static('public'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/userOtherDetails', userOtherDetailsRouter);
app.use('/api/v1/onboarding', userOnBoardingRouter);

app.use('/api/v1/universities', universityRouter);
app.use('/api/v1/lockUniversity', lockUniversityRouter);
app.use('/api/v1/ai', aiChatRouter);







app.get('/', (req,res)=>{
    res.status(200).send({"message" : "Hello World!"});
});


app.use(errorMiddleware);

export  {app};