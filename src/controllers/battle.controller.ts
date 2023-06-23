import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Battle } from '../models';
import { FigthService } from '../services/battle/figth.service';
import { Id } from 'objection';

const list = async (_req: Request, res: Response): Promise<Response> => {
  const battles = await Battle.query().withGraphFetched(
    '[monsterARelation, monsterBRelation, winnerRelation]'
  );
  return res.status(StatusCodes.OK).json(battles);
};

const create = async (req: Request, res: Response): Promise<Response> => {
  const { monsterA, monsterB } = req.body;
  const battle = await FigthService.create(monsterA, monsterB);
  return res.status(StatusCodes.CREATED).json({ data: battle });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;
  await Battle.query()
    .deleteById(id)
    .throwIfNotFound({ message: `Battle with id=${id} not found` });
  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const BattleController = {
  list,
  create,
  remove,
};
