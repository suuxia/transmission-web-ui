import type { Torrent, Session, SessionStats, Response } from '@/types/rpc.ts';

const BASE_URL = '/transmission/rpc';

interface Args {
  ids?: number[];
  fields?: string[];
}

function createRPC() {
  let sessionId = '';

  function send(method: string, args?: Args, tag?: string) {
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

  return async function <T>(method: string, args?: Args, tag?: string): Promise<Response<T>> {
    let response = await send(method, args, tag);

    if (response.status === 409) {
      sessionId = response.headers.get('X-Transmission-Session-Id') ?? '';
      response = await send(method, args, tag);
    }

    return response.json();
  };
}

const client = createRPC();

async function startTorrent(ids: number | number[]) {
  const params = {
    ids: typeof ids === 'number' ? [ids] : ids,
  };

  const response = await client('torrent-start', params);
  return response.arguments;
}

/**
 * 停止种子
 * @param ids
 */
async function stopTorrent(ids: number | number[]) {
  const params = {
    ids: typeof ids === 'number' ? [ids] : ids,
  };

  const response = await client('torrent-stop', params);
  return response.arguments;
}

async function setTorrent() {
  const response = await client('torrent-set');
  return response.arguments;
}

async function addTorrent(path: string, content: string) {
  const params = {
    'download-dir': path,
    metainfo: content,
  };

  const response = await client('torrent-add', params);
  return response.arguments;
}

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
    'uploadedEver',
    'addedDate',
    'doneDate',
    'activityDate',
    'creator',
    'hashString',
    'files',
    'fileStats',
    'peers',
    'uploadRatio',
    'trackerStats',
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
  return client<Session>('session-get');
}

/**
 * 获取session状态
 * @returns
 */
function getSessionStats() {
  return client<SessionStats>('session-stats');
}

export { startTorrent, stopTorrent, addTorrent, setTorrent, getTorrent, getSession, getSessionStats };
