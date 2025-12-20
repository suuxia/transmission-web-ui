import { memo } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Info, Pause, Play, Trash2, Download, Upload } from 'lucide-react';
import { ActionType, type ActionTypeEnum } from '@/types/torrent';
import { formatSize, formatPercent } from '@/utils/format.ts';

interface TorrentProps {
  id: number;
  title: string;
  downloadedEver: number;
  totalSize: number;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  status: number;
  onAction?: (type: ActionTypeEnum, id: number) => void;
}

const TorrentComponent = memo(function TorrentComponent(props: TorrentProps) {
  const { id, title, downloadedEver, totalSize, percentDone, rateDownload, rateUpload, status, onAction } = props;
  const handleTorrentStatusUpdate = () => {
    onAction?.(status == 0 ? ActionType.Start : ActionType.Stop, id);
  };

  console.log('TorrentComponent', id);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="p-4 flex flex-col gap-2 select-none hover:bg-gray-200" data-id={id}>
          <div className="flex justify-between gap-10">
            <div className="truncate" title={title}>{title}</div>
            <div className="grow-0 shrink-0 w-10">
              {
                status === 0 ? <Pause /> : <Play />
              }
            </div>
          </div>
          <div>
            <Progress value={percentDone * 100} />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <div>
              <span>
                {formatSize(downloadedEver)}/{formatSize(totalSize)}
              </span>
              <span>({formatPercent(percentDone)})</span>
            </div>
            <div className="flex items-center gap-1">
              {
                rateDownload > 0
                  ? <>
                    <span><Download size={16} /></span>
                    <span>{formatSize(rateDownload)}/s</span>
                  </>
                  : <></>
              }
              {
                rateUpload > 0
                  ? <>
                    <span><Upload size={16} /></span>
                    <span>{formatSize(rateUpload)}/s</span>
                  </>
                  : <></>
              }
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={handleTorrentStatusUpdate}>
          {status === 0 ? (
            <>
              <Play />
              开始
            </>
          ) : (
            <>
              <Pause />
              暂停
            </>
          )}
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onAction?.(ActionType.Detail, id)}>
          <Info />
          种子详情
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction?.(ActionType.Delete, id)} className="text-red-600">
          <Trash2 />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

export default TorrentComponent;
