/**
 * Transmission's RPC specification 
 * https://github.com/transmission/transmission/blob/main/docs/rpc-spec.md
 */

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
  downloadedEver: number;
  downloadDir: string;
  activityDate: number;
  trackers?: Tracker[];
  trackerStats?: TrackerStats[];
  trackerList?: string;
  hashString?: string;
  status: number;
  files?: File[];
  fileStats?: FileStats[];
  peers?: Peer[];
  peersConnected: number;
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
  'download-dir': string;
  'default-trackers': string;
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

export interface SessionInfoStats {
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