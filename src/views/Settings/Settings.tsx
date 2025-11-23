import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Session } from '@/types/rpc.ts';
import { getSession } from '@/utils/rpc.ts';

function Settings() {
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    const init = async () => {
      const data = await getSession();
      setSession(data.arguments);
    };

    init();
  }, []);

  const tabClass = 'w-28';

  return (
    <div className="p-4">
      <Tabs defaultValue="base">
        <TabsList>
          <TabsTrigger value="base" className={tabClass}>
            基本设置
          </TabsTrigger>
          <TabsTrigger value="trackers" className={tabClass}>
            Trackers
          </TabsTrigger>
          <TabsTrigger value="bandwidth" className={tabClass}>
            带宽设置
          </TabsTrigger>
        </TabsList>
        <TabsContent value="base">
          <div>Transmission 版本：{session?.version}</div>
          <div>下载目录：{session?.['download-dir']}</div>
          <div>
            临时目录：
            <Switch checked={session?.['incomplete-dir-enabled']} />
          </div>
          <div>临时目录：{session?.['incomplete-dir']}</div>
          <div>
            在未完成的文件名后加上<span className='inline-block px-2 bg-gray-100'>.part</span>后缀：
            <Switch checked={session?.['rename-partial-files']} />
          </div>
          <div>
            时段限制：
            <Switch checked={session?.['alt-speed-enabled']} />
          </div>
          <div>时段限制下载速度：{session?.['alt-speed-down']}</div>

          <div>
            最大硬盘缓存（MB）：
            {session?.['cache-size-mb']}
          </div>

          <div>
            端口号：
            {session?.['peer-port']}
          </div>

          <div>
            随机端口：
            <Switch checked={session?.['peer-port-random-on-start']} />
          </div>

          <div>
            分布式哈希表(DHT)：
            <Switch checked={session?.['dht-enabled']} />
          </div>
          <div>
            本地用户发现(LPD)：
            <Switch checked={session?.['dht-enabled']} />
          </div>
          <div>
            节点信息交换(PEX)：
            <Switch checked={session?.['pex-enabled']} />
          </div>
        </TabsContent>
        <TabsContent value="trackers">
          <div>
            <Textarea rows={15} className="w-full">
              {session?.['default-trackers']}
            </Textarea>
          </div>
        </TabsContent>
        <TabsContent value="bandwidth">
          <div>
            下载限制：
            <Switch checked={session?.['speed-limit-down-enabled']} />
          </div>
          <div>
            最大下载速度：
            {session?.['speed-limit-down']}
          </div>
          <div>
            上传限制：
            <Switch checked={session?.['speed-limit-up-enabled']} />
          </div>
          <div>
            最大上传速度：
            {session?.['speed-limit-up']}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
