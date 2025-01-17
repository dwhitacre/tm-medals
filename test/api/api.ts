import { faker } from "@faker-js/faker";
import type { Pool } from "pg";

export const mapGet = (pool: Pool, accountId: string) => {
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

export const playerGet = (pool: Pool, accountId: string) => {
  return pool.query(
    `
      select * from Players
      where AccountId=$1
    `,
    [accountId]
  );
};

export const playerCreate = ({
  accountId = faker.string.uuid(),
  name = faker.internet.username(),
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
}: {
  accountId?: string;
  name?: string;
  body?: any;
  method?: string;
  headers?: any;
} = {}) => {
  return fetch("http://localhost:8081/players", {
    body: JSON.stringify(body ?? { accountId, name }),
    method,
    headers,
  });
};

export const medalTimesGet = (accountId: string, mapUid: string) => {
  return fetch(
    `http://localhost:8081/medaltimes?accountId=${accountId}&mapUid=${mapUid}`
  );
};

export const medalTimesCreate = ({
  accountId = faker.string.uuid(),
  mapUid = faker.string.uuid(),
  medalTime = faker.number.int({ min: 1, max: 20000 }),
  body,
  method = "POST",
  headers = {
    "x-api-key": "developer-test-key",
  },
}: {
  accountId?: string;
  mapUid?: string;
  medalTime?: number;
  body?: any;
  method?: string;
  headers?: any;
} = {}) => {
  return fetch("http://localhost:8081/medaltimes", {
    body: JSON.stringify(body ?? { accountId, mapUid, medalTime }),
    method,
    headers,
  });
};
