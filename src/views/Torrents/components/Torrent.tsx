import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Info, Pause, Play, Trash2 } from 'lucide-react';
import { formatSize, formatPercent } from '@/utils/format.ts';
import type { Torrent } from '@/types/rpc.ts';

interface TorrentProps {
  torrent: Torrent;
  onDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function TorrentComponent(props: TorrentProps) {
  const { torrent, onDetail, onDelete } = props;
  const handleTorrentStatusUpdate = () => {};

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="p-4 flex flex-col gap-2 select-none hover:bg-gray-200" data-id={torrent.id}>
          <div className="truncate" title={torrent.name}>
            {torrent.name}
          </div>
          <div>
            <Progress value={torrent.percentDone * 100} />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <div>
              <span>
                {formatSize(torrent.downloadedEver)}/{formatSize(torrent.totalSize)}
              </span>
              <span>({formatPercent(torrent.percentDone)})</span>
            </div>
            <div>{torrent.status > 0 ? formatSize(torrent.rateDownload) + '/s ' : <></>}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={handleTorrentStatusUpdate}>
          {torrent.status === 0 ? (
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
        <ContextMenuItem onSelect={() => onDetail?.(torrent.id)}>
          <Info />
          种子详情
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete?.(torrent.id)} className="text-red-600">
          <Trash2 />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default TorrentComponent;
