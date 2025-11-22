import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label.tsx';
import { deleteTorrent } from '@/utils/rpc.ts';

interface TorrentProps {
  open: boolean;
  torrentId: number;
  onOpenChange?: (open: boolean) => void;
  onUpdate?: (id: number, type: string) => void;
  onDelete?: (id: number) => void;
}

function DeleteTorrent(props: TorrentProps) {
  const { torrentId, open, onOpenChange } = props;
  const [withData, setWithData] = useState<boolean | 'indeterminate'>(false);

  const onDelete = () => {
    if (torrentId) {
      deleteTorrent(torrentId, withData === 'indeterminate' ? false : withData);
    }

    onOpenChange?.(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>删除种子确认</DialogTitle>
        </DialogHeader>
        <div className='flex space-x-2'>
          <Checkbox id="with-data" checked={withData} onCheckedChange={setWithData} />
          <Label htmlFor="with-data">同时删除数据</Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onDelete}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTorrent;
