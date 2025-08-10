import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog.tsx';

function AddTorrent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>添加种子</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加种子</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>
          <div className='h-20 border-1 text-sm'>拖放文件到该区域或点击选择文件</div>
        </div>
        <DialogFooter>
          <Button>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTorrent;
