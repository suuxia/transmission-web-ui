import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    <div className="px-4">
      <div className="line-clamp-2 break-all mb-2" title={torrent?.name}>
        {torrent?.name}
      </div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="files" className="w-24">
            文件
          </TabsTrigger>
          <TabsTrigger value="tracker" className="w-24">
            服务器
          </TabsTrigger>
          <TabsTrigger value="info" className="w-24">
            详细信息
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files">
          <div className="h-80 select-none">
            <Table className="table-fixed">
              <TableCaption />
              <TableHeader className="sticky top-0 bg-gray-50">
                <TableRow>
                  <TableHead className="w-3/4">文件名称</TableHead>
                  <TableHead>文件大小</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {torrent?.files?.map((file) => {
                  return (
                    <TableRow key={file.name}>
                      <TableCell className="truncate" title={file.name}>
                        {file.name}
                      </TableCell>
                      <TableCell>{formatSize(file.length)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="tracker"></TabsContent>
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
