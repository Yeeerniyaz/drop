import fs from 'fs';
import path from 'path';

import User from '../models/user.js';
import Disk from '../models/Disk.js';

export async function GetDisk(req, res) {
	try {
		const userId = req.userId;
		const user = await User.findOne({ _id: userId });

		const parent = req.query.parent;

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const files = await Disk.find({
			user: user._id,
			parent: parent || null,
		});

		return res.status(200).json(files);
	} catch (err) {
		res.status(500).json({ message: 'Server error, try again later' });
	}
}

export async function getDirFavorites(req, res) {
	try {
		const userId = req.userId;
		const user = await User.findOne({ _id: userId });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const files = await Disk.find({
			user: user._id,
			favorite: true,
		});

		return res.status(200).json(files);
	} catch (err) {
		res.status(500).json({ message: 'Server error, try again later' });
	}
}

export async function CreateDir(req, res) {
	try {
		const { name, parent } = req.body;
		const file = new Disk({ name, type: 'dir', parent: parent || null, user: req.userId });

		const parentFile = parent === '' ? false : await Disk.findOne({ _id: parent });

		if (!parentFile) {
			file.path = `files/${req.userId}/${name}`;
			if (!fs.existsSync(`files/${req.userId}/${name}`)) {
				fs.mkdirSync(`files/${req.userId}/${name}`);
				await file.save();
				return res.status(200).json(file);
			} else {
				await Disk.findByIdAndDelete(file._id);
				return res.status(400).json({ message: 'Folder already exists' });
			}
		} else {
			file.path = `${parentFile.path}/${file.name}`;
			await file.save();
			parentFile.childs.push(file._id);
			await parentFile.save();

			if (!fs.existsSync(file.path)) {
				fs.mkdirSync(file.path);
				return res.status(200).json(file);
			} else {
				await Disk.findByIdAndDelete(file._id);
				return res.status(400).json({ message: 'Folder already exists' });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

export async function FileUpload(req, res) {
	try {
		const file = req.files.file;
		const parent = req.body.parent;
		const type = file.name.split('.').pop();
		const fileName = (file.name = Buffer.from(file.name, 'latin1').toString('utf8'));

		const user = await User.findById(req.userId);

		if (!user) {
			return res.status(404).json({ message: 'No access' });
		}

		if (user.usedSpace + file.size > user.diskSpace) {
			return res.status(400).json({ message: 'Not enough disk space' });
		}

		user.usedSpace += file.size;

		const disk = new Disk({
			name: fileName,
			size: file.size,
			mimeTypes: file.mimetype,
			user: req.userId,
			type,
			parent,
		});

		if (parent) {
			const parentFile = await Disk.findOne({ _id: parent, user: user._id });
			if (!parentFile) {
				return res.status(404).json({ message: 'No access' });
			}
			parentFile.childs.push(disk._id);
			await parentFile.save();
			disk.path = `${parentFile.path}/${fileName}`;
			if (fs.existsSync(`${parentFile.path}/${fileName}`)) {
				return res.status(400).json({ message: 'Such a file already exists' });
			}
			file.mv(`${parentFile.path}/${fileName}`);
			await disk.save();
			await user.save();
		} else {
			disk.path = `files/${req.userId}/${fileName}`;
			if (fs.existsSync(`files/${req.userId}/${fileName}`)) {
				return res.status(400).json({ message: 'Such a file already exists' });
			}
			file.mv(`files/${req.userId}/${fileName}`);
			await disk.save();
			await user.save();
		}

		res.status(200).json(disk);
	} catch (err) {
		res.status(500).json({ message: 'Server error, try again later' });
	}
}

export async function FileDownload(req, res) {
	const { id } = req.params;
	const user = await User.findById(req.userId);
	const file = await Disk.findOne({ _id: id, user: user._id });

	if (!file) {
		return res.status(404).json({ message: 'No access' });
	}

	const filePath = path.resolve(`${file.path}`);
	res.download(filePath, file.name);
	try {
	} catch (err) {
		res.status(500).json({ message: err });
	}
}

export async function DeleteFile(req, res) {
	try {
		const user = await User.findById(req.userId);
		const { id } = req.params;

		if (!user) {
			return res.status(404).json({ message: 'Access denied' });
		}

		const file = await Disk.findOne({ _id: id, user: user._id });

		if (!file) {
			return res.status(404).json({ message: 'Access denied' });
		}

		if (file.type === 'dir') {
			const files = await Disk.find({ parent: file._id });
			if (files.length) {
				return res.status(400).json({ message: 'Folder is not empty' });
			} else {
				fs.rmdirSync(`${file.path}`);
			}
		} else {
			fs.unlinkSync(`${file.path}`);
			user.usedSpace -= file.size;
		}

		await user.save();

		await Disk.findByIdAndDelete(id);

		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ message: 'Server error, please try again later' });
	}
}
