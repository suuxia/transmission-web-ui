import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet.tsx';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Torrent } from '@/types/rpc.ts';
import AddTorrent from './components/AddTorrent.tsx';
import TorrentComponent from './components/Torrent.tsx';
import TorrentDetail from './components/TorrentDetail.tsx';
import { getTorrent } from '@/utils/rpc.ts';

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

  const onDelete = (id: number) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

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
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [loader]);

  return (
    <div>
      <div className="p-4 flex justify-between">
        <Input className="w-60" />
        <AddTorrent />
      </div>
      <div>
        {torrents.map((torrent) => (
          <TorrentComponent key={torrent.id} torrent={torrent} onDetail={onDetail} onDelete={onDelete} />
        ))}
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-[400px] sm:w-[640px] sm:max-w-[700px]">
          <SheetHeader>
            <SheetTitle>种子详情</SheetTitle>
            <SheetDescription />
          </SheetHeader>
          <TorrentDetail torrentId={selectedId} />
        </SheetContent>
      </Sheet>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>删除种子确认</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Torrents;
