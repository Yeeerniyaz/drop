import mongoose from 'mongoose';
const User = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	fristName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	avatarUrl: {
		type: String,
		default:
			'https://img.freepik.com/premium-vector/cute-panda-stylized-character-gentle-background-fluffy-cute-childish-poster-illustration-avatar-wallpaper-cartoon-teddy-bear-zoo-flat-design-art-concept-vector-illustration_579956-3298.jpg',
	},
	password: {
		type: String,
		required: true,
	},
	dickSpace: {
		type: Number,
		default: 1024 * 1024 * 100,
	},
	usedSpace: {
		type: Number,
		default: 0,
	},
});

export default mongoose.model('User', User);
