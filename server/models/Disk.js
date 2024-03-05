import mongoose from 'mongoose';

const Disk = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			require: true,
		},
		size: {
			type: Number,
			default: 0,
		},
		path: {
			type: String,
			default: '',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},

		mimeTypes: {
			type: String,
			default: '',
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Disk',
		},
		childs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Disk',
			},
		],
	},

	{ timestamps: true },
);

export default mongoose.model('Disk', Disk);
