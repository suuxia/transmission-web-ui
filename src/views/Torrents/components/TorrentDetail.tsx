import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator"
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
    <div className="flex-1 px-4 pb-4 min-h-0 flex flex-col gap-2">
      <div className="line-clamp-2 break-all" title={torrent?.name}>
        {torrent?.name}
      </div>
      <Tabs defaultValue="files" className="flex-1 min-h-0">
        <TabsList>
          <TabsTrigger value="files" className="w-24">
            文件
          </TabsTrigger>
          <TabsTrigger value="peer" className="w-24">
            用户
          </TabsTrigger>
          <TabsTrigger value="tracker" className="w-24">
            服务器
          </TabsTrigger>
          <TabsTrigger value="info" className="w-24">
            详细信息
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="min-h-0">
          <div className="h-full select-none">
            <Table className="table-fixed">
              <TableCaption />
              <TableHeader className="sticky top-0 bg-gray-50">
                <TableRow>
                  <TableHead className="w-2/3">文件名称</TableHead>
                  <TableHead>文件大小</TableHead>
                  <TableHead className="text-center">下载</TableHead>
                  <TableHead className="text-center">进度</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {torrent?.files?.map((file, index) => {
                  return (
                    <TableRow key={file.name}>
                      <TableCell className="truncate" title={file.name}>
                        {file.name}
                      </TableCell>
                      <TableCell>{formatSize(file.length)}</TableCell>
                      <TableCell className="text-center">{torrent?.fileStats?.[index].wanted ? '是' : '否'}</TableCell>
                      <TableCell className="text-center">
                        {((file.bytesCompleted / file.length) * 100).toLocaleString()}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="peer">
          {torrent?.peers?.map((peer) => (
            <div key={peer.address}>
              {peer.address}
              {peer.clientName}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="tracker" className="min-h-0 overflow-auto">
          <div className="flex flex-col gap-2">
            {torrent?.trackerStats?.map((tracker) => {
              return (
                <div key={tracker.id} className="border-1 p-2 flex flex-col gap-1">
                  <div>
                    <div className='flex gap-2'>
                      <span className="font-bold">{tracker.sitename}</span>
                      <Badge variant='secondary'>{tracker.announceState === 0 ? '非活动' : '活动'}</Badge>
                    </div>
                    <div className="text-sm text-gray-400">{tracker.host}</div>
                  </div>
                  <div className='text-sm flex items-center h-5 space-x-2 '>
                    <div>更新时间：{formatDateTime(tracker.lastAnnounceTime)}</div>
                    <Separator orientation="vertical" />
                    <div>下载数：{tracker.downloadCount}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="info" className="text-sm">
          <div>
            <div>
              保存路径：
              {torrent?.downloadDir}
            </div>
            <div>
              种子hash：
              {torrent?.hashString}
            </div>
            <div>
              文件大小：
              {formatSize(torrent?.totalSize ?? 0)}
            </div>
            <div>
              添加时间：
              {torrent?.addedDate ? formatDateTime(torrent?.addedDate) : ''}
            </div>
            <div>
              完成时间：
              {torrent?.doneDate ? formatDateTime(torrent?.doneDate) : ''}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TorrentDetail;
