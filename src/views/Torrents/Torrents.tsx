import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
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
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedTorrent, setSelectedTorrent] = useState<string>();

  useEffect(() => {
    getTorrent().then((data) => (data ? setTorrents(data.torrents) : null));
  }, []);

  const menuSelect = (event: any) => {
    if (event.target) {
      const id = getTargetDataId(event.target);
      setSelectedTorrent(id ?? '');
    }
  };

  return (
    <div>
      <div className="p-4 flex justify-between">
        <Input className="w-60" />
        <Button>添加种子</Button>
      </div>
      <ContextMenu>
        <ContextMenuTrigger onContextMenu={menuSelect}>
          {torrents.map((torrent) => (
            <TorrentComponent key={torrent.id} torrent={torrent} />
          ))}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Play />
            开始
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setOpenSheet(true)}>
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
            <SheetDescription>种子的详细信息</SheetDescription>
          </SheetHeader>
          <TorrentDetail torrentId={selectedTorrent} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Torrents;
