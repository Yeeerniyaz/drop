import jwt from 'jsonwebtoken';

export default async function (req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decodedToken.userId;
		next();
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
}
