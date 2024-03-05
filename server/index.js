import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import mongoose, { set } from 'mongoose';
import fs from 'fs';

import AuthRoutes from './routes/auth.js';
import DiskRoutes from './routes/disk.js';
import MainRoutes from './routes/main.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));

// prettier-ignore
mongoose
	.set('strictQuery', false)
	.connect(process.env.MONGO_DB)
	.then(() => { console.log('DB connection established'); })
	.catch((err) => { console.log(err); });

if (!fs.existsSync('files')) {
	fs.mkdirSync('files');
}

app.use('/auth', AuthRoutes);
app.use('/disk', DiskRoutes);
app.use('/main', MainRoutes);

app.listen(process.env.PORT, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('Local port is ' + process.env.PORT);
	}
});
