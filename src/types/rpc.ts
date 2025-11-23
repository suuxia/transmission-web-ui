/**
 * Transmission's RPC specification
 * https://github.com/transmission/transmission/blob/main/docs/rpc-spec.md
 */

/**
 * 请求方法名
 */
export type MethodName =
  | 'torrent-set'
  | 'torrent-get'
  | 'torrent-start'
  | 'torrent-stop'
  | 'torrent-add'
  | 'torrent-remove'
  | 'session-set'
  | 'session-get'
  | 'session-stats';

/**
 * 种子信息
 */
export interface Torrent {
  id: number;
  name: string;
  isFinished: boolean;
  isPrivate: boolean;
  isStalled: boolean;
  /** 上传速率 */
  rateUpload: number;
  /** 下载速率 */
  rateDownload: number;
  /** 总大小 */
  totalSize: number;
  /** 完成比率 */
  percentDone: number;
  /** 已下载大小 */
  downloadedEver: number;
  /** 保存路径 */
  downloadDir: string;
  /** 添加时间 */
  addedDate: number;
  /** 完成时间 */
  doneDate: number;
  /** 活动日期 */
  activityDate: number;
  /** 已上传大小 */
  uploadedEver: number;
  uploadLimit: number;
  uploadLimited: boolean;
  creator: string;
  eta: number;
  trackers?: Tracker[];
  trackerStats?: TrackerStats[];
  trackerList?: string;
  /** hash信息 */
  hashString?: string;
  /** 种子状态 */
  status: number;
  files?: File[];
  fileStats?: FileStats[];
  peers?: Peer[];
  peersFrom?: PeerFrom;
  peersConnected: number;
  uploadRatio: number;
}

/**
 * 文件信息
 */
export interface File {
  bytesCompleted: number;
  length: number;
  name: string;
  begin_piece: number;
  end_piece: number;
}

/**
 * 文件状态
 */
export interface FileStats {
  bytesCompleted: number;
  wanted: boolean;
  priority: number;
}

/**
 * Tracker
 */
interface Tracker {
  announce: string;
  id: number;
  scrape: string;
  sitename: string;
  tier: string;
}

/**
 * TrackerStats
 */
interface TrackerStats {
  id: number;
  sitename: string;
  host: string;
  announce: string;
  announceState: number;
  lastAnnounceTime: number;
  downloadCount: number;
  leecherCount: number;
  seederCount: number;
}

export interface Peer {
  address: string;
  clientName: string;
  clientIsChoked: boolean;
  clientIsInterested: boolean;
  flagStr: string;
  isDownloadingFrom: boolean;
  isEncrypted: boolean;
  isIncoming: boolean;
  isUploadingTo: boolean;
  isUTP: boolean;
  peerIsChoked: boolean;
  peerIsInterested: boolean;
  port: number;
  progress: number;
  rateToClient: number;
  rateToPeer: number;
}

export interface PeerFrom {
  fromCache: number;
  fromDht: number;
  fromIncoming: number;
  fromLpd: number;
  fromLtep: number;
  fromPex: number;
  fromTracker: number;
}

/**
 * Session信息
 */
export interface Session {
  'alt-speed-down': number;
  'alt-speed-enabled': boolean;
  'alt-speed-up': number;
  'config-dir': string;
  'cache-size-mb': number;
  /** 下载目录 */
  'download-dir': string;
  'incomplete-dir-enabled': boolean;
  /** 未完成目录 */
  'incomplete-dir': string;
  /**默认trackers */
  'default-trackers': string;
  'dht-enabled': boolean;
  'lpd-enabled': boolean;
  /**随机端口号 */
  'peer-port-random-on-start': boolean;
  /**端口号 */
  'peer-port': number;
  'pex-enabled': boolean;
  'rename-partial-files': boolean;
  'speed-limit-down-enabled': boolean;
  'speed-limit-down': number;
  'speed-limit-up-enabled': boolean;
  'speed-limit-up': number;
  version: string;
}

export interface SessionStats {
  activeTorrentCount: number;
  downloadSpeed: number;
  pausedTorrentCount: number;
  torrentCount: number;
  uploadSpeed: number;
  'cumulative-stats': SessionInfoStats;
  'current-stats': SessionInfoStats;
}

interface SessionInfoStats {
  uploadedBytes: number;
  downloadedBytes: number;
  filesAdded: number;
  sessionCount: number;
  sessionActive: number;
}

export interface Response<T> {
  arguments?: T;
  tag?: string;
  result: string;
}
