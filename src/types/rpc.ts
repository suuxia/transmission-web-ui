
export interface Torrent {
  id: number;
  name: string;
  totalSize: number;
  percentDone: number;
  addedDate: number;
  doneDate: number;
  activityDate: number;
}

export interface Response<T = any> {
  arguments?: T;
  tag?: string;
  result: string;
}