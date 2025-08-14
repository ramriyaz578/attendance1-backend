const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const { connectDB } = require('./db/configdb');

connectDB().catch(err => console.error('Database connection failed:', err));

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});
 

// async function fixIndexes() {
//   try {


//     const collection = mongoose.connection.collection('districts');

//     // Drop wrong index if exists
//     const indexes = await collection.indexes();
//     const nameIndex = indexes.find(index => index.name === 'name_1');

//     if (nameIndex) {
//       console.log('Dropping invalid index "name_1"...');
//       await collection.dropIndex('name_1');
//     }

//     // Ensure correct index on `district` field
//     console.log('Creating unique index on "district"...');
//     await collection.createIndex({ district: 1 }, { unique: true });

//     console.log('Index fix completed ✅');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error fixing indexes:', error);
//     process.exit(1);
//   }
// }
// fixIndexes().catch(err => console.error('Error in fixIndexes:', err));

app.use('/api/get', require('./routes/userroute'));
app.use('/api/user', require('./routes/authroues'));
app.use('/api/request', require('./routes/resetpassword'));
app.use('/api/branch', require('./routes/branches'));
app.use('/api/district', require('./routes/districtroute'));
app.use('/api/attendance', require('./routes/attendanceroutes'))
app.use('/api/token', require('./routes/fcmroute'))
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/department' , require('./routes/departmentroute'))



app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}` ));
