import { Router } from 'express';
import multer from 'multer';
import { MonsterController } from '../controllers/monster.controller';
import tryCatch from '../middlewares/try-catch';

const router = Router();
const upload = multer({ dest: 'upload' });

router.get('/', tryCatch(MonsterController.list));
router.post('/', tryCatch(MonsterController.create));
router.post('/import', upload.single('monsters'), MonsterController.importCsv);
router.get('/:id', MonsterController.get);
router.put('/:id', MonsterController.update);
router.delete('/:id', MonsterController.remove);

export default router;
