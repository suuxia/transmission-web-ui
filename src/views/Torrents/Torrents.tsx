import { useState, useEffect, type MouseEvent } from 'react';
import { useLoaderData } from 'react-router';
import { Input } from '@/components/ui/input.tsx';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu.tsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet.tsx';
import { Info, Play, Trash2 } from 'lucide-react';
import type { Torrent } from '@/types/rpc.ts';
import AddTorrent from './components/AddTorrent.tsx';
import TorrentComponent from './components/Torrent.tsx';
import TorrentDetail from './components/TorrentDetail.tsx';
import { getTorrent } from '@/utils/rpc.ts';

function getTargetDataId(target: HTMLElement) {
  for (let i = 0; i < 10; i++) {
    if (target.dataset.id !== undefined) {
      return target.dataset.id;
    }
    if (!target.parentElement) return;
    target = target.parentElement;
  }
}

function Torrents() {
  const loader = useLoaderData();
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const data = await getTorrent();
      if (!data) return;

      if (loader && loader === 'downloading') {
        setTorrents(data.torrents.filter((item) => item.status === 4));
      } else if (loader && loader === 'done') {
        setTorrents(data.torrents.filter((item) => item.status === 0));
      } else {
        setTorrents(data.torrents);
      }
    };

    init();

    const timer = setInterval(() => {
      init();
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [loader]);

  const menuSelect = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | undefined;
    if (target) {
      const id = getTargetDataId(target);
      setSelectedTorrent(id);
    }
  };

  return (
    <div>
      <div className="p-4 flex justify-between">
        <Input className="w-60" />
        <AddTorrent />
      </div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div onContextMenu={menuSelect}>
            {torrents.map((torrent) => (
              <TorrentComponent key={torrent.id} torrent={torrent} />
            ))}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Play />
            开始
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => {
              if (selectedTorrent) setOpenSheet(true);
            }}
          >
            <Info />
            种子详情
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-red-600">
            <Trash2 />
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-[400px] sm:w-[640px] sm:max-w-[700px]">
          <SheetHeader>
            <SheetTitle>种子详情</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <TorrentDetail torrentId={selectedTorrent} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Torrents;
