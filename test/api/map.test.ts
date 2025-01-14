import { afterAll, beforeAll, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import { Pool } from "pg";

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

export const mapGet = (accountId: string) => {
  return pool.query(
    `
      select * from Maps
      where MapUid=$1
    `,
    [accountId]
  );
};

export const mapCreate = ({
  mapUid = faker.string.uuid(),
  authorTime = faker.number.int({ min: 1, max: 20000 }),
  name = faker.word.words(3),
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
}: {
  mapUid?: string;
  authorTime?: number;
  name?: string;
  body?: any;
  method?: string;
  headers?: any;
} = {}) => {
  return fetch("http://localhost:8081/maps", {
    body: JSON.stringify(body ?? { mapUid, authorTime, name }),
    method,
    headers,
  });
};

test("get map dne", async () => {
  const response = await mapGet("000");
  expect(response.rowCount).toEqual(0);
});

test("create map no adminkey", async () => {
  const response = await mapCreate({
    headers: {},
  });
  expect(response.status).toEqual(401);
});

test("create map bad method", async () => {
  const response = await mapCreate({ method: "DELETE" });
  expect(response.status).toEqual(400);
});

test("create map bad body", async () => {
  const response = await mapCreate({
    body: faker.string.uuid(),
  });
  expect(response.status).toEqual(400);
});

test("create map no mapUid", async () => {
  const response = await mapCreate({
    body: {},
  });
  expect(response.status).toEqual(400);
});

test("create map no name", async () => {
  const response = await mapCreate({
    body: { mapUid: faker.string.uuid(), authorTime: 20000 },
  });
  expect(response.status).toEqual(400);
});

test("create map no authorTime", async () => {
  const response = await mapCreate({
    body: { mapUid: faker.string.uuid(), name: faker.word.words(3) },
  });
  expect(response.status).toEqual(400);
});

test("create map", async () => {
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await mapCreate({
    mapUid,
    name,
    authorTime,
  });

  expect(response.status).toEqual(200);

  const dbResponse = await mapGet(mapUid);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].mapuid).toEqual(mapUid);
  expect(dbResponse.rows[0].name).toEqual(name);
  expect(dbResponse.rows[0].authortime).toEqual(authorTime);
  expect(dbResponse.rows[0].campaign).toEqual(null);
  expect(dbResponse.rows[0].campaignIndex).toEqual(undefined);
  expect(dbResponse.rows[0].totdDate).toEqual(undefined);
  expect(dbResponse.rows[0].nadeo).toBeFalse();
});

test("create map with properties", async () => {
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
  });

  expect(response.status).toEqual(200);

  const dbResponse = await mapGet(mapUid);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].mapuid).toEqual(mapUid);
  expect(dbResponse.rows[0].name).toEqual(name);
  expect(dbResponse.rows[0].authortime).toEqual(authorTime);
  expect(dbResponse.rows[0].campaign).toEqual(campaign);
  expect(dbResponse.rows[0].campaignindex).toEqual(campaignIndex);
  expect(dbResponse.rows[0].totddate).toEqual(totdDate);
  expect(dbResponse.rows[0].nadeo).toEqual(nadeo);
});

test("create map repeat is an update", async () => {
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });

  const response = await mapCreate({
    mapUid,
    name,
    authorTime,
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await mapCreate({
    mapUid,
    name: name2,
    authorTime: authorTime2,
  });

  expect(response2.status).toEqual(200);

  const dbResponse = await mapGet(mapUid);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].mapuid).toEqual(mapUid);
  expect(dbResponse.rows[0].name).toEqual(name2);
  expect(dbResponse.rows[0].authortime).toEqual(authorTime2);
  expect(dbResponse.rows[0].campaign).toEqual(null);
  expect(dbResponse.rows[0].campaignIndex).toEqual(undefined);
  expect(dbResponse.rows[0].totdDate).toEqual(undefined);
  expect(dbResponse.rows[0].nadeo).toBeFalse();
});

test("create map with properties repeat is an update", async () => {
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = false;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });
  const campaign2 = "Training123";
  const campaignIndex2 = 4;
  const totdDate2 = "2024-02-01";
  const nadeo2 = true;

  const response2 = await mapCreate({
    body: {
      mapUid,
      name: name2,
      authorTime: authorTime2,
      campaign: campaign2,
      campaignIndex: campaignIndex2,
      totdDate: totdDate2,
      nadeo: nadeo2,
    },
  });

  expect(response2.status).toEqual(200);

  const dbResponse = await mapGet(mapUid);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].mapuid).toEqual(mapUid);
  expect(dbResponse.rows[0].name).toEqual(name2);
  expect(dbResponse.rows[0].authortime).toEqual(authorTime2);
  expect(dbResponse.rows[0].campaign).toEqual(campaign2);
  expect(dbResponse.rows[0].campaignindex).toEqual(campaignIndex2);
  expect(dbResponse.rows[0].totddate).toEqual(totdDate2);
  expect(dbResponse.rows[0].nadeo).toEqual(nadeo2);
});

test("create map with properties repeat without properties doesnt override optional parameters", async () => {
  const mapUid = faker.string.uuid();
  const name = faker.word.words(3);
  const authorTime = faker.number.int({ min: 1, max: 20000 });
  const campaign = "Training";
  const campaignIndex = 3;
  const totdDate = "2024-01-01";
  const nadeo = true;

  const response = await mapCreate({
    body: {
      mapUid,
      name,
      authorTime,
      campaign,
      campaignIndex,
      totdDate,
      nadeo,
    },
  });

  expect(response.status).toEqual(200);

  const name2 = faker.word.words(3);
  const authorTime2 = faker.number.int({ min: 1, max: 20000 });

  const response2 = await mapCreate({
    body: {
      mapUid,
      name: name2,
      authorTime: authorTime2,
    },
  });

  expect(response2.status).toEqual(200);

  const dbResponse = await mapGet(mapUid);

  expect(dbResponse.rowCount).toEqual(1);
  expect(dbResponse.rows[0].mapuid).toEqual(mapUid);
  expect(dbResponse.rows[0].name).toEqual(name2);
  expect(dbResponse.rows[0].authortime).toEqual(authorTime2);
  expect(dbResponse.rows[0].campaign).toEqual(campaign);
  expect(dbResponse.rows[0].campaignindex).toEqual(campaignIndex);
  expect(dbResponse.rows[0].totddate).toEqual(totdDate);
  expect(dbResponse.rows[0].nadeo).toEqual(nadeo);
});
