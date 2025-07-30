import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Progress } from "@/components/ui/progress";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { Torrent } from "@/types/rpc.ts";
import { getTorrent } from "@/utils/rpc.ts";
import { formatSize } from "@/utils/format.ts";


function Torrents() {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [selectedTorrent, setSelectedTorrent] = useState<number | null>(null);

  useEffect(() => {
    getTorrent().then((data) => data ? setTorrents(data.torrents) : null);
  }, []);

  const menuSelect = (event: any) => {

    if (event.target) {
      const id = event.target.dataset.id;
      setSelectedTorrent(id);
    }
  }

  return (
    <div>
      <div className='p-4 flex gap-2'>
        <Input className='w-60' />
        <Button>添加</Button>
      </div>
      <ContextMenu>
        <ContextMenuTrigger onContextMenu={menuSelect}>
          {torrents.map((torrent) => (<Torrent key={torrent.id} torrent={torrent} />))}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>详情</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className='text-red-700'>删除</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

interface TorrentProps {
  torrent: Torrent;
}

function Torrent(props: TorrentProps) {
  const { torrent } = props;

  return (
    <div className='p-4 flex flex-col gap-2 select-none hover:bg-gray-200' data-id={torrent.id}>
      <div className='truncate' title={torrent.name}>{torrent.name}</div>
      <div>
        <Progress value={torrent.percentDone * 100} />
      </div>
      <div className='text-sm text-gray-400'>
        <div>{formatSize(torrent.totalSize)}/{formatSize(torrent.totalSize)}</div>
      </div>
    </div>
  );
}

export default Torrents;