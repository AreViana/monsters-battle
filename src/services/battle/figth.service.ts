import { Id } from 'objection';
import { Monster, Battle } from '../../models';
import { ValidationError } from 'objection';

const create = async (monsterAId: Id, monsterBId: Id) => {
  if (!monsterAId || !monsterBId) {
    throw new ValidationError({
      message: 'Missing monster id',
      type: 'MissingParameters',
    });
  }
  const monsterA: Monster = await Monster.query()
    .findById(monsterAId)
    .throwIfNotFound({ message: `Monster with id=${monsterAId} not found` });

  const monsterB: Monster = await Monster.query()
    .findById(monsterBId)
    .throwIfNotFound({ message: `Monster with id=${monsterBId} not found` });

  const result = figth(monsterA, monsterB);
  const battle = await Battle.query().insert(result).withGraphFetched('winnerRelation');
  return battle;
};

const figth = (monsterA: Monster, monsterB: Monster) => {
  let winner: Monster | undefined;
  [monsterA, monsterB] = sortAttackers(monsterA, monsterB);
  const logger = [];
  logger.push(roundLog(monsterA, monsterB));

  do {
    const dammage = dammageCalculation(monsterA, monsterB);
    monsterB.hp -= dammage.dammageA;
    winner = winnerCalculation(monsterA, monsterB);
    logger.push(roundLog(monsterA, monsterB));
    if (winner === undefined) {
      monsterA.hp -= dammage.dammageB;
      winner = winnerCalculation(monsterA, monsterB);
      logger.push(roundLog(monsterB, monsterA));
    }
  } while (winner === undefined);

  console.info(`Battle between ${monsterA.name} and ${monsterB.name}`);
  console.table(logger);

  return {
    monsterA: monsterA.id,
    monsterB: monsterB.id,
    winner: winner.id,
  };
};

const sortAttackers = (
  monsterA: Monster,
  monsterB: Monster
): [Monster, Monster] => {
  const firstAttacker =
    monsterA.speed > monsterB.speed
      ? monsterA
      : monsterA.speed < monsterB.speed
      ? monsterB
      : monsterA.attack >= monsterB.attack
      ? monsterA
      : monsterB;

  const secondAttacker = firstAttacker === monsterA ? monsterB : monsterA;
  return [firstAttacker, secondAttacker];
};

const winnerCalculation = (monsterA: Monster, monsterB: Monster) => {
  if (monsterA.hp > 0 && monsterB.hp <= 0) {
    monsterB.hp = 0;
    return monsterA;
  } else if (monsterA.hp <= 0 && monsterB.hp > 0) {
    monsterA.hp = 0;
    return monsterB;
  }
  return undefined;
};

const dammageCalculation = (monsterA: Monster, monsterB: Monster) => {
  const dammageA =
    monsterA.attack <= monsterB.defense
      ? 1
      : monsterA.attack - monsterB.defense;

  const dammageB =
    monsterB.attack <= monsterA.defense
      ? 1
      : monsterB.attack - monsterA.defense;

  return { dammageA, dammageB };
};

const roundLog = (attacker: Monster, defender: Monster) => {
  return {
    'Attacker name': attacker.name,
    'Defender Name': defender.name,
    'Attacker HP': attacker.hp,
    'Defender HP': defender.hp,
  };
};

export const FigthService = {
  create,
};
