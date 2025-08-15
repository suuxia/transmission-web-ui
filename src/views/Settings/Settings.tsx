import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
        </TabsContent>
        <TabsContent value="trackers">
          <div>
            默认Tracker：
            <br />
            <textarea rows={20} cols={120}>
              {session?.['default-trackers']}
            </textarea>
          </div>
        </TabsContent>
        <TabsContent value="bandwidth"></TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
