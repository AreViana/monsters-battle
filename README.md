# Battle of Monsters

## Technologies
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Objection.js](https://vincit.github.io/objection.js/)
- [Knex.js](http://knexjs.org/)
- [Jest](https://jestjs.io/)

## Description
This is a NodeJS API with express, typescript and objection ORM.
You can create a battle between 2 monsters through the endpoint
POST `http://localhost:5000/battle` 
with the body `{ "monsterA": 3, "monsterB": 1 }`

and in your application terminal you will see their life points in each confrontation turn like this:

![image](https://github.com/AreViana/monsters-battle/assets/37125161/cbf38217-2e81-4731-a934-58450b252571)


in the end you will see which monster runs out of life points first.

## Available endpoints
https://github.com/AreViana/monsters-battle/blob/main/data/Monsters%20API.postman_collection.json
