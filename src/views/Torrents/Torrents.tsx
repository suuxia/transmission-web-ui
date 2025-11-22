import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { Input } from '@/components/input.tsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet.tsx';
import VirtualizedList from '@/components/VirtualizedList/VirtualizedList.tsx';
import { Search } from 'lucide-react';
import type { Torrent } from '@/types/rpc.ts';
import AddTorrent from './components/AddTorrent.tsx';
import DeleteTorrent from './components/DeleteTorrent.tsx';
import TorrentComponent from './components/Torrent.tsx';
import TorrentDetail from './components/TorrentDetail.tsx';
import { getTorrent, startTorrent, stopTorrent } from '@/utils/rpc.ts';

/**
 * 种子列表
 */
function Torrents() {
  const loader = useLoaderData();
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const onDetail = (id: number) => {
    setSelectedId(id);
    setOpenSheet(true);
  };

  const onUpdate = (id: number, type: string) => {
    if (type === 'start') {
      startTorrent(id);
    } else if (type === 'stop') {
      stopTorrent(id);
    }
  };

  const onDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const loadData = async (loadType: string): Promise<void> => {
    const data = await getTorrent();
    if (!data) return;
    switch (loadType) {
      case 'downloading':
        setTorrents(data.torrents.filter((item) => item.status === 4));
        break;

      case 'done':
        setTorrents(data.torrents.filter((item) => item.status === 0));
        break;

      default:
        setTorrents(data.torrents);
        break;
    }
  };

  useEffect(() => {
    loadData(loader);
    const timer = setInterval(() => loadData(loader), 5000);

    return () => {
      clearInterval(timer);
    };
  }, [loader]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between">
        <Input prefix={<Search size={14} />} />
        <AddTorrent />
      </div>
      <VirtualizedList listData={torrents} itemHeight={100}>
        {(torrent, index) => (
          <TorrentComponent
            key={index}
            torrent={torrent}
            onDetail={onDetail}
            onUpdate={onUpdate}
            onDelete={onDeleteConfirm}
          />
        )}
      </VirtualizedList>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-[400px] sm:w-[640px] sm:max-w-[700px] gap-0">
          <SheetHeader>
            <SheetTitle>种子详情</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <TorrentDetail torrentId={selectedId} />
        </SheetContent>
      </Sheet>

      <DeleteTorrent torrentId={selectedId!} open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} />
    </div>
  );
}

export default Torrents;
