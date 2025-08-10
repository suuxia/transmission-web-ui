import type { Torrent, Response } from '@/types/rpc.ts';

const BASE_URL = '/transmission/rpc';

interface Args {
  fields?: string[];
}

function createRPC() {
  let sessionId = '';

  function send(method: string, args: Args, tag?: string) {
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

  return async function <T>(method: string, args: Args, tag?: string): Promise<Response<T>> {
    let response = await send(method, args, tag);

    if (response.status === 409) {
      sessionId = response.headers.get('X-Transmission-Session-Id') ?? '';
      response = await send(method, args, tag);
    }

    return response.json();
  };
}

const client = createRPC();

type TorrentFields = keyof Torrent;

/**
 * 获取种子信息，ids为空时，获取种子列表
 * @param ids
 * @returns
 */
async function getTorrent(ids?: number | number[]) {
  const listFields: TorrentFields[] = [
    'id',
    'name',
    'rateDownload',
    'rateUpload',
    'downloadedEver',
    'totalSize',
    'percentDone',
    'addedDate',
    'doneDate',
    'status',
    'activityDate',
  ];

  const detailFields: TorrentFields[] = [
    'id',
    'name',
    'totalSize',
    'downloadDir',
    'percentDone',
    'addedDate',
    'doneDate',
    'activityDate',
    'hashString',
    'files',
    'peers',
  ];

  const params = {
    ids: typeof ids === 'number' ? [ids] : ids,
    fields: ids ? detailFields : listFields,
  };
  const resp = await client<{ torrents: Torrent[] }>('torrent-get', params);
  return resp.arguments;
}

/**
 * 获取session信息
 * @returns
 */
function getSession() {
  return client('session-get', {});
}

export { getTorrent, getSession };
