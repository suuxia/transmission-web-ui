import type { Torrent, Response } from '@/types/rpc.ts';

const BASE_URL = '/transmission/rpc';

function createRPC() {
  let sessionId = '';

  function send(method: string, args: any, tag?: string) {
    return fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Transmission-Session-Id': sessionId,
      },
      body: JSON.stringify({
        method,
        arguments: args,
        tag,
      }),
    });
  }

  return async function<T>(method: string, args: any, tag?: string): Promise<Response<T>> {

    let response = await send(method, args, tag);

    if (response.status === 409) {
      sessionId = response.headers.get('X-Transmission-Session-Id') ?? '';
      response = await send(method, args, tag);
    }

    return response.json();
  }
};

const client = createRPC();

type Fields = keyof Torrent;

async function getTorrent(ids?: number | number[]) {
  const listFields: Fields[] = [
    'id',
    'name',
    'totalSize',
    'percentDone',
    'addedDate',
    'doneDate',
    'activityDate',
  ];

  const detailFields: Fields[] = [
    'id',
    'name',
    'totalSize',
    'percentDone',
    'addedDate',
    'doneDate',
    'activityDate',
    'files',
  ];

  const params = {
    ids: typeof ids === 'number' ? [ids] : ids,
    fields: ids ? detailFields : listFields,
  };
  const resp = await client<{ torrents: Torrent[]}>('torrent-get', params);
  return resp.arguments;
}

function getSession(){
  return client('session-get', {});
}

export {
  getTorrent,
  getSession,
}