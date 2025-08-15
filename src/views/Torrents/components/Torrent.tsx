import { Progress } from '@/components/ui/progress.tsx';
import { formatSize, formatPercent } from '@/utils/format.ts';
import type { Torrent } from '@/types/rpc.ts';

interface TorrentProps {
  torrent: Torrent;
}

function TorrentComponent(props: TorrentProps) {
  const { torrent } = props;

  return (
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
        <div>{torrent.status > 0 ? formatSize(torrent.rateDownload) + '/s' : ''}</div>
      </div>
    </div>
  );
}

export default TorrentComponent;
