import { Router } from 'express';
import { BattleController } from '../controllers/battle.controller';
import tryCatch from '../middlewares/try-catch';

const router = Router();

router.get('/', BattleController.list);
router.post('/', tryCatch(BattleController.create));
router.delete('/:id', tryCatch(BattleController.remove));

export default router;
