import { useEffect, useState, useMemo, Fragment } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, File as FileIcon, Folder, FolderOpen } from 'lucide-react';
import type { Torrent, File, FileStats } from '@/types/rpc.ts';
import { getTorrent } from '@/utils/rpc.ts';
import { formatDateTime, formatPercent, formatSize } from '@/utils/format';

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
          <TorrentFiles torrent={torrent} />
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

interface Tree {
  name: string;
  type: 'file' | 'dir';
  bytes?: number;
  completedBytes?: number;
  wanted?: boolean;
  children: Tree[];
}

type NFile = File & FileStats;

/**
 * 树形视图表格组件
 * @param files 文件列表
 * @param fileStats 文件统计信息
 */
function TreeViewTable({ files, fileStats }: { files: File[]; fileStats?: FileStats[] }) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // 构建目录树结构
  const buildTree = (files: NFile[]) => {
    if (!files || files.length === 0) return [];

    const tree: Tree[] = [];

    for (const file of files) {
      const pathParts = file.name.split('/');

      let current = tree;

      pathParts.forEach((part, partIndex) => {
        const isFile = partIndex === pathParts.length - 1;

        if (isFile) {
          // 将文件添加到当前目录
          current.push({
            name: part,
            type: 'file',
            bytes: file.length,
            completedBytes: file.bytesCompleted,
            wanted: file.wanted,
            children: [],
          });
        } else {
          // 创建或获取子目录
          const node = current.find((item) => item.name === part);
          if (!node) {
            const children: Tree = {
              name: part,
              type: 'dir',
              children: [],
            };
            current.push(children);
            current = children.children;
          } else {
            current = node.children;
          }
        }
      });
    }

    return tree;
  };

  const directoryTree = useMemo(() => {
    const n_files = files.map((file, index) => {
      const stats = fileStats?.[index] ?? {
        bytesCompleted: 0,
        wanted: false,
        priority: 0,
      };
      return { ...stats, ...file };
    });
    return buildTree(n_files);
  }, [files, fileStats]);

  const toggleDirectory = (path: string) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // 递归渲染目录树
  const renderTree = (nodes: Tree[], level = 0) => {
    return nodes.map((node) => {
      const key = node.name;
      if (node.type === 'dir') {
        const isExpanded = expandedDirs.has(node.name);
        return (
          <Fragment key={key}>
            <TableRow className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2" title={node.name} style={{ paddingLeft: `${level * 20}px` }}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleDirectory(node.name)}>
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </Button>
                  {isExpanded ? (
                    <FolderOpen className="shrink-0 h-4 w-4 text-blue-500" />
                  ) : (
                    <Folder className="shrink-0 h-4 w-4 text-blue-500" />
                  )}
                  <span className="overflow-hidden">{node.name}</span>
                </div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="text-center"></TableCell>
              <TableCell className="text-center"></TableCell>
            </TableRow>
            {isExpanded && (
              <>
                {/* 渲染子目录 */}
                {node.children && node.children.length > 0 ? renderTree(node.children, level + 1) : <></>}
              </>
            )}
          </Fragment>
        );
      } else if (node.type === 'file') {
        const progress = node.bytes! > 0 ? node.completedBytes! / node.bytes! : 0;

        // 渲染文件
        return (
          <TableRow key={key}>
            <TableCell className="truncate" title={node.name} style={{ paddingLeft: `${level * 20 + 24}px` }}>
              <div className="flex items-center gap-2">
                <FileIcon className="shrink-0 h-4 w-4 text-gray-500" />
                <span className="overflow-hidden">{node.name}</span>
              </div>
            </TableCell>
            <TableCell>{formatSize(node.bytes ?? 0)}</TableCell>
            <TableCell className="text-center">{node.wanted ? '是' : '否'}</TableCell>
            <TableCell className="text-center">{formatPercent(progress)}</TableCell>
          </TableRow>
        );
      }
    });
  };

  return (
    <Table className="table-fixed" key={'tree-table'}>
      <TableHeader className="sticky top-0 bg-gray-50">
        <TableRow>
          <TableHead className="w-2/3">文件/文件夹</TableHead>
          <TableHead>大小</TableHead>
          <TableHead className="text-center">下载</TableHead>
          <TableHead className="text-center">进度</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{renderTree(directoryTree)}</TableBody>
    </Table>
  );
}

/**
 * 种子文件信息
 * @param props
 */
function TorrentFiles(props: { torrent: Torrent }) {
  const { torrent } = props;
  const [isTreeView, setIsTreeView] = useState(false);

  return (
    <div className="h-full select-none flex flex-col">
      <div className="mb-2 flex gap-2">
        <Button variant={isTreeView ? 'default' : 'outline'} size="sm" onClick={() => setIsTreeView(!isTreeView)}>
          {isTreeView ? '列表视图' : '树形视图'}
        </Button>
      </div>

      {isTreeView ? (
        <TreeViewTable files={torrent.files || []} fileStats={torrent.fileStats} />
      ) : (
        <Table className="table-fixed" key={'list-table'}>
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
      )}
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
          <div key={tracker.id} className="border p-2 flex flex-col gap-1">
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
          <TableCell className="w-25">保存路径</TableCell>
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
