import { useRef } from 'react';
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
import { addTorrent } from '@/utils/rpc.ts';

function AddTorrent() {
  const fileRef = useRef<HTMLInputElement>(null);
  const onSubmit = () => {
    const files = fileRef.current?.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const data = reader.result as string;

      const base64 = data.split(',')[1];

      console.log(base64);

      //const base64String = encode(data);

      //console.log(base64String);

      addTorrent('/downloads', base64);
    };

    reader.onerror = () => {
      console.log('Error', reader.error);
    };

    reader.readAsDataURL(file);
  };

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
          <div className="h-20 border-1 text-sm text-center">
            <div>拖放文件到该区域或点击选择文件</div>
            <input type="file" ref={fileRef} />
            <div></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTorrent;
