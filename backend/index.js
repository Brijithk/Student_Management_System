import express from 'express';
import mongoose from 'mongoose';
import loginRouter from './routes/login.js'; // Assuming you have a login route defined
import cors from 'cors';


// const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(cors());
const port=3000;

mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  app.use('/login',loginRouter);
  // app.use(userRoutes);

  app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;

//       Student JSON Example

// {
//     "roll":"001",
//     "username":"brijith",
//     "age":"42",
//     "phones":["9876543210","9876543210"],
//     "marks":{
//              "english":"42",
//               "computer":"33",
//                "maths":"78",
//                "physics":"90",
//                "chemistry":"90"
// }
// }

//       Admin JSON Example
// {
    // "username":"brijith",
    // "password":"1234"
// }