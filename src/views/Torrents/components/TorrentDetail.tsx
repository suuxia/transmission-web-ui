import {useEffect, useState} from "react";
import type {Torrent} from "@/types/rpc.ts";
import {getTorrent} from "@/utils/rpc.ts";

interface DetailProps {
  torrentId?: string;
}

/**
 * 种子详情
 * @param props
 * @constructor
 */
function TorrentDetail(props: DetailProps) {
  const [torrent, setTorrent] = useState<Torrent>();

  useEffect(() => {
    getTorrent(Number(props.torrentId)).then((data) => {
      if (!data) return;
      const { torrents } = data;
      if (torrents?.length > 0) setTorrent(data?.torrents[0])
    })
  }, [props.torrentId]);

  return (
    <div className='px-2 select-none'>
      <div className='line-clamp-2 break-all' title={torrent?.name}>{ torrent?.name }</div>
      <div className='py-2 text-gray-500'>
        {
          torrent?.files.map((file) => {
            return (
              <div className='text-sm truncate' title={file.name}>{file.name}</div>
            )
          })
        }
      </div>
    </div>
  );
}

export default TorrentDetail;