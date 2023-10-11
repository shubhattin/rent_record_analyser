import { fetch_post, fetch_get, Fetch } from "@/tools/fetch";

const KEY = process.env.DETA_PROJECT_KEY || process.env.DETA_KEY;

const URL = (baseName: string) => {
  console.log([998823188, KEY]);
  return `https://database.deta.sh/v1/${KEY?.split("_")[0]}/${baseName}`;
};

export const base_fetch = async (baseName: string, last: string = null!) => {
  const req = fetch_post(`${URL(baseName)}/query`, {
    json: {
      last: last,
    },
    headers: {
      "X-Api-Key": KEY!,
    },
    next: {
      revalidate: 60, // in every 1 mins reconsider cache
    },
  });
  const resp = await req;
  const json: {
    paging: {
      size: number;
      last?: string;
    };
    items: any[];
  } = await resp.json();
  return json;
};

export const base_get = async (baseName: string, key: string) => {
  const req = fetch_get(`${URL(baseName)}/items/${key}`, {
    headers: {
      "X-Api-Key": KEY!,
    },
    next: {
      revalidate: 60, // in every 1 mins reconsider cache
    },
  });
  const resp = await req;
  return await resp.json();
};

export const base_put = async (baseName: string, values: any[]) => {
  const req = Fetch(`${URL(baseName)}/items`, {
    method: "PUT",
    json: {
      items: values,
    },
    headers: {
      "X-Api-Key": KEY!,
    },
    next: {
      revalidate: 60, // in every 1 mins reconsider cache
    },
  });
  const resp = await req;
  return await resp.json();
};
