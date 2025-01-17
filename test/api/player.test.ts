import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";
import { playerCreate, playerGet } from "./api";

let pool: Pool;

beforeAll(() => {
  pool = new Pool({
    connectionString:
      "postgres://tmmedals:Passw0rd!@localhost:5432/tmmedals?pool_max_conns=10",
  });
});

afterAll(async () => {
  await pool.end();
});

test("get player dne", async () => {
  const response = await playerGet(pool, "000");
  expect(response.rowCount).toEqual(0);
});

test("create player no adminkey", async () => {
  const response = await playerCreate({
    headers: {},
  });
  expect(response.status).toEqual(401);
});

test("create player bad method", async () => {
  const response = await playerCreate({ method: "DELETE" });
  expect(response.status).toEqual(400);
});

test("create player bad body", async () => {
  const response = await playerCreate({
    body: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create player no account id", async () => {
  const response = await playerCreate({
    body: {},
  });
  expect(response.status).toEqual(400);
});

test("create player no name", async () => {
  const response = await playerCreate({
    body: { accountId: faker.string.uuid() },
  });
  expect(response.status).toEqual(400);
});

test("create player", async () => {
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const response = await playerCreate({
    accountId,
    name,
  });

  expect(response.status).toEqual(200);

  const dbResponse = await playerGet(pool, accountId);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].accountid).toEqual(accountId);
  expect(dbResponse.rows[0].name).toEqual(name);
});

test("create player repeat is an update", async () => {
  const accountId = faker.string.uuid();
  const name = faker.internet.username();
  const response = await playerCreate({
    accountId,
    name,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.internet.username();
  const response2 = await playerCreate({
    accountId,
    name: name2,
  });

  expect(response2.status).toEqual(200);

  const dbResponse = await playerGet(pool, accountId);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].accountid).toEqual(accountId);
  expect(dbResponse.rows[0].name).toEqual(name2);
});
