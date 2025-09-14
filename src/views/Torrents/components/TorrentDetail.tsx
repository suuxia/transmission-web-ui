import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Torrent } from '@/types/rpc.ts';
import { getTorrent } from '@/utils/rpc.ts';
import { formatDateTime, formatSize } from '@/utils/format';

interface DetailProps {
  torrentId?: number;
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
    getTorrent(torrentId).then((data) => {
      if (!data) return;
      const { torrents } = data;
      if (torrents?.length > 0) setTorrent(data?.torrents[0]);
    });
  }, [torrentId]);

  if (!torrent) return null;

  return (
    <div className="flex-1 px-4 pb-4 min-h-0 flex flex-col gap-2">
      <div className="line-clamp-2 break-all" title={torrent.name}>
        {torrent.name}
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
          <TorrentFiles  torrent={torrent} />
        </TabsContent>
        <TabsContent value="peer">
          <div>
            <Table className="table-fixed">
              <TableCaption />
              <TableHeader className="sticky top-0 bg-gray-50">
                <TableRow>
                  <TableHead>IP地址</TableHead>
                  <TableHead>客户端</TableHead>
                  <TableHead>标记</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {torrent.peers?.map((peer) => (
                  <TableRow key={peer.address}>
                    <TableCell>{peer.address}</TableCell>
                    <TableCell>{peer.clientName}</TableCell>
                    <TableCell>{peer.flagStr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="tracker" className="min-h-0 overflow-auto">
          <TorrentTracker torrent={torrent} />
        </TabsContent>
        <TabsContent value="info" className="text-sm">
          <TorrentInfo torrent={torrent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * 种子文件信息
 * @param props
 */
function TorrentFiles(props: { torrent: Torrent }) {
  const { torrent } = props;
  return (
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
          {torrent.files?.map((file, index) => {
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
  );
}

/**
 * 种子tracker信息
 * @param props
 */
function TorrentTracker(props: { torrent: Torrent }) {
  const { torrent } = props;
  return (
    <div className="flex flex-col gap-2">
      {torrent.trackerStats?.map((tracker) => {
        return (
          <div key={tracker.id} className="border-1 p-2 flex flex-col gap-1">
            <div>
              <div className="flex gap-2">
                <span className="font-bold">{tracker.sitename}</span>
                <Badge variant="secondary">{tracker.announceState === 0 ? '非活动' : '活动'}</Badge>
              </div>
              <div className="text-sm text-gray-400">{tracker.host}</div>
            </div>
            <div className="text-sm flex items-center h-5 space-x-2 ">
              <div>更新时间：{formatDateTime(tracker.lastAnnounceTime)}</div>
              <Separator orientation="vertical" />
              <div>下载数：{tracker.downloadCount}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * 种子详细信息
 * @param props
 */
function TorrentInfo(props: { torrent: Torrent }) {
  const { torrent } = props;
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="w-[100px]">保存路径</TableCell>
          <TableCell>{torrent.downloadDir}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>种子hash</TableCell>
          <TableCell>{torrent.hashString}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>文件大小</TableCell>
          <TableCell>{formatSize(torrent.totalSize)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>上传大小</TableCell>
          <TableCell>{formatSize(torrent.uploadedEver)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>上传比率</TableCell>
          <TableCell>{torrent.uploadRatio}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>添加时间</TableCell>
          <TableCell>{formatDateTime(torrent.addedDate)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>完成时间</TableCell>
          <TableCell>{formatDateTime(torrent.doneDate)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>创建者</TableCell>
          <TableCell>{torrent.creator}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default TorrentDetail;
