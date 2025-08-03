/**
 * 种子信息
 */
export interface Torrent {
  id: number;
  name: string;
  isFinished: boolean;
  isPrivate: boolean;
  isStalled: boolean;
  rateUpload: number;
  rateDownload:  number;
  totalSize: number;
  percentDone: number;
  addedDate: number;
  doneDate: number;
  activityDate: number;
  files: File[];
}

/**
 * 文件信息
 */
export interface File {
  bytesCompleted: number;
  length: number;
  name: string;
  'begin_piece': number;
  'end_piece': number;
}

/**
 * Session信息
 */
export interface Session {
  'alt-speed-down': number;
  'alt-speed-enabled': boolean;
  'alt-speed-up': number;
  version: string;
}

export interface Response<T = any> {
  arguments?: T;
  tag?: string;
  result: string;
}