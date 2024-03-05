import { Router } from 'express';

import isAuth from '../middleware/isAuth.js';

import Disk from '../models/Disk.js';

const router = Router();

router.get('', isAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const allFiles = await Disk.find({ user: userId });

		let fileSizes = {
			image: 0,
			video: 0,
			audio: 0,
			document: 0,
			archive: 0,
			other: 0,
		};

		allFiles.forEach((file) => {
			if (file.mimeTypes.includes('image')) {
				fileSizes.image += file.size;
			} else if (file.mimeTypes.includes('video')) {
				fileSizes.video += file.size;
			} else if (file.mimeTypes.includes('audio')) {
				fileSizes.audio += file.size;
			} else if (file.mimeTypes.includes('document')) {
				fileSizes.document += file.size;
			} else if (file.mimeTypes.includes('archive')) {
				fileSizes.archive += file.size;
			} else {
				fileSizes.other += file.size;
			}
		});

		res.status(200).json({ success: true, fileSizes });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

export default router;
