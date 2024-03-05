import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';

import User from '../models/user.js';
import Disk from '../models/Disk.js';

export async function Register(req, res) {
	try {
		const { email, fristName, lastName } = req.body;

		if (!email || !req.body.password || !fristName || !lastName) {
			return res.status(400).json({
				message: 'Not all fields are filled in',
			});
		}

		const isUnique = await User.findOne({ email });

		if (isUnique) {
			return res.status(400).json({
				message: 'A user with this email already exists',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(req.body.password, salt);
		const doc = new User({ email, fristName, lastName, password: hash });
		const user = await doc.save();

		if (!fs.existsSync(`files/${user._id}`)) {
			fs.mkdirSync(`files/${user._id}`);
		}

		const homeDirDoc = new Disk({
			name: 'Home',
			type: 'dir',
			user: user._id,
			favorite: true,
			path: `files/${user._id}/Home`,
		});

		const homeDir = await homeDirDoc.save();
		fs.mkdirSync(`files/${user._id}/Home`);

		const createDirectory = async (name, parent, user) => {
			const dirDoc = new Disk({
				name,
				type: 'dir',
				parent,
				user,
				favorite: true,
				path: `files/${user._id}/Home/${name}`,
			});

			fs.mkdirSync(`files/${user}/Home/${name}`);
			const savedDir = await dirDoc.save();

			const parentDir = await Disk.findById(parent);
			parentDir.childs.push(savedDir._id);
			await parentDir.save();

			return savedDir;
		};

		await createDirectory(user.fristName, homeDir._id, user._id);
		await createDirectory('Documents', homeDir._id, user._id);
		await createDirectory('Music', homeDir._id, user._id);
		await createDirectory('Video', homeDir._id, user._id);
		await createDirectory('Pictures', homeDir._id, user._id);
		await createDirectory('Public', homeDir._id, user._id);

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '10d',
		});

		res.status(200).json({ token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export async function Login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: 'Login or password not entered',
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(405).json({ message: 'Login or password is incorrect' });
		}

		const isMatch = await bcrypt.compare(req.body.password, user.password);

		if (!isMatch) {
			return res.status(405).json({ message: 'Login or password is incorrect' });
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '10d',
		});

		res.status(200).json({ token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

export async function GetMe(req, res) {
	try {
		const userId = req.userId;
		const user = await User.findOne({ _id: userId }).select('-password');

		if (!user) {
			return res.status(405).json({ message: 'Этот пользователь не найден' });
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: 'Ошибка сервера, повторите попытку позже' });
	}
}
