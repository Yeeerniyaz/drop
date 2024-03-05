import { Router } from 'express';
import { GetMe, Login, Register } from '../controllers/auth.js';
import isAuth from '../middleware/isAuth.js';

const router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/getme', isAuth, GetMe);

export default router;
