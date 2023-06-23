import { Id, RelationMappings } from 'objection';
import Base from './base';
import { Monster } from './monster.model';

export class Battle extends Base {
  id!: Id;
  monsterA!: Id;
  monsterB!: Id;
  winner!: Id;

  static tableName = 'battle';

  static get relationMappings(): RelationMappings {
    return {
      monsterARelation: {
        relation: Base.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.monsterA',
          to: 'monster.id',
        },
      },
      monsterBRelation: {
        relation: Base.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.monsterB',
          to: 'monster.id',
        },
      },
      winnerRelation: {
        relation: Base.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'battle.winner',
          to: 'monster.id',
        },
      },
    };
  }
}
