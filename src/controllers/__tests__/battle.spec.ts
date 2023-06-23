import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { Battle } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('BattleController', () => {
  describe('List', () => {
    test('should list all battles', async () => {
      const response = await request(server).get('/battle');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      const response = await request(server)
        .post('/battle')
        .send({ monsterA: 1, monsterB: undefined });
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body.message).toBe('Missing monster id');
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      const response = await request(server)
        .post('/battle')
        .send({ monsterA: 1, monsterB: 999 });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Monster with id=999 not found');
    });

    test('should insert a battle of monsters successfully', async () => {
      const response = await request(server)
        .post('/battle')
        .send({ monsterA: 3, monsterB: 4 });
      expect(response.status).toBe(StatusCodes.CREATED);
    });

    test('should insert a battle of monsters successfully with monster 1 winning', async () => {
      const response = await request(server)
        .post('/battle')
        .send({ monsterA: 3, monsterB: 2 });
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner).toBe(3);
    });

    test('should insert a battle of monsters successfully with monster 2 winning', async () => {
      const response = await request(server)
        .post('/battle')
        .send({ monsterA: 1, monsterB: 5 });
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.winner).toBe(5);
    });
  });

  describe('Delete Battle', () => {
    test('should delete a battle successfully', async () => {
      const { id } = await Battle.query().insert({ monsterA: 1, monsterB: 2 });
      const totalBattles = await Battle.query().resultSize();
      const deleteResponse = await request(server).delete(`/battle/${id}`);
      expect(await Battle.query().resultSize()).toBe(totalBattles - 1);
      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if the battle doesn't exists", async () => {
      const response = await request(server).delete(`/battle/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Battle with id=9999 not found');
    });
  });
});
