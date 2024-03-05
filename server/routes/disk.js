import { Router } from 'express';
import isAuth from '../middleware/isAuth.js';
import { CreateDir, GetDisk, getDirFavorites, FileUpload, FileDownload, DeleteFile } from '../controllers/disk.js';

const router = Router();

router.get('', isAuth, GetDisk);
router.post('', isAuth, CreateDir);
router.get('/favorites', isAuth, getDirFavorites);
router.post('/upload', isAuth, FileUpload);
router.get('/download/:id', isAuth, FileDownload);
router.delete('/:id', isAuth, DeleteFile);

export default router;
