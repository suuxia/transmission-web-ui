import { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import VirtualizedList from '@/components/VirtualizedList/VirtualizedList.tsx';
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
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [filter, setFilter] = useState('all');
  const statusCount = useMemo(() => {
    const counts = {
      all: torrents.length,
      downloading: 0,
      seeding: 0,
      stopped: 0,
    };

    for (const torrent of torrents) {
      if (torrent.status === 4) {
        counts.downloading++;
      } else if (torrent.status === 6) {
        counts.seeding++;
      } else if (torrent.status === 0) {
        counts.stopped++;
      }
    }

    return counts;
  }, [torrents]);
  const displayTorrents = useMemo(() => {
    if (filter === 'downloading') {
      return torrents.filter((item) => item.status === 4);
    } else if (filter === 'seeding') {
      return torrents.filter((item) => item.status === 6);
    } else if (filter === 'stopped') {
      return torrents.filter((item) => item.status === 0);
    }
    return torrents;
  }, [filter, torrents]);

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

  /**
   * 加载数据
   */
  const loadData = async (): Promise<void> => {
    const data = await getTorrent();
    setTorrents(data?.torrents ?? []);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => loadData(), 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="h-0 grow flex flex-col">
      <div className="p-4 flex justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">全部 ({statusCount.all})</TabsTrigger>
            <TabsTrigger value="downloading">下载 ({statusCount.downloading})</TabsTrigger>
            <TabsTrigger value="stopped">暂停 ({statusCount.stopped})</TabsTrigger>
            <TabsTrigger value="seeding">做种 ({statusCount.seeding})</TabsTrigger>
          </TabsList>
        </Tabs>
        <AddTorrent />
      </div>
      <VirtualizedList listData={displayTorrents} itemHeight={100}>
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
