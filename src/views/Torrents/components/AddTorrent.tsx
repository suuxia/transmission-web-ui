import { useRef, useState } from 'react';
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
import { Upload, X } from 'lucide-react';

function AddTorrent() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // 当 dialog 关闭时清空所有状态
      setSelectedFiles([]);
      setDragActive(false);
      // 清空文件输入框
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.name.endsWith('.torrent') || file.type === 'application/x-bittorrent'
      );
      setSelectedFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(file =>
        file.name.endsWith('.torrent') || file.type === 'application/x-bittorrent'
      );
      setSelectedFiles(files);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result as string;
        const base64 = data.split(',')[1];
        addTorrent('/downloads', base64);
        console.log(`Added torrent: ${file.name}`);

        // 如果是最后一个文件，关闭 dialog
        if (index === selectedFiles.length - 1) {
          setOpen(false);
        }
      };

      reader.onerror = () => {
        console.log('Error', reader.error);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>添加种子</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>添加种子</DialogTitle>
          <DialogDescription>支持拖拽 .torrent 文件到下方区域</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              `}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileInput}
                accept=".torrent,application/x-bittorrent"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  拖放 .torrent 文件到该区域，或点击选择文件
                </p>
                <p className="text-xs text-gray-500">支持选择多个文件</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">已选择的文件:</p>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 gap-1 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 min-w-fit">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
          >
            确认添加 ({selectedFiles.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTorrent;