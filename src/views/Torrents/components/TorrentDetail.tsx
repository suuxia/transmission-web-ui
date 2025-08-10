import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Torrent } from '@/types/rpc.ts';
import { getTorrent } from '@/utils/rpc.ts';
import { formatDateTime, formatSize } from '@/utils/format';

interface DetailProps {
  torrentId?: string;
}

/**
 * 种子详情
 * @param props
 * @constructor
 */
function TorrentDetail(props: DetailProps) {
  const { torrentId } = props;
  const [torrent, setTorrent] = useState<Torrent>();

  useEffect(() => {
    getTorrent(Number(torrentId)).then((data) => {
      if (!data) return;
      const { torrents } = data;
      if (torrents?.length > 0) setTorrent(data?.torrents[0]);
    });
  }, [torrentId]);

  return (
    <div className="px-4 select-none">
      <div className="line-clamp-2 break-all mb-2" title={torrent?.name}>
        {torrent?.name}
      </div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="files">文件</TabsTrigger>
          <TabsTrigger value="info">详细信息</TabsTrigger>
        </TabsList>
        <TabsContent value="files">
          <div className=" text-gray-500 h-55 overflow-auto">
            {torrent?.files.map((file) => {
              return (
                <div className="flex text-sm">
                  <div className="truncate w-10/12" title={file.name} key={file.name}>
                    {file.name}
                  </div>
                  <div>
                    {formatSize(file.length)}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="info" className="text-sm">
          <div>
            添加时间：
            {torrent?.addedDate ? formatDateTime(torrent?.addedDate) : ''}
          </div>
          <div>
            完成时间：
            {torrent?.doneDate ? formatDateTime(torrent?.doneDate) : ''}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TorrentDetail;
