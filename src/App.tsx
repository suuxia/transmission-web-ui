import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import Torrents from '@/views/Torrents/Torrents.tsx';
import Settings from '@/views/Settings/Settings.tsx';

function App() {
  const [view, setView] = useState('all');
  const itemClassName = 'select-none text-center py-2 rounded-md hover:bg-gray-200 data-[state=active]:bg-gray-200';
  return (
    <>
      <div className="fixed flex flex-col w-48 h-dvh p-2 gap-2 border-r-1 border-slate-200">
        <div
          className={itemClassName}
          data-state={view === 'all' ? 'active' : 'inactive'}
          onClick={() => setView('all')}
        >
          全部
        </div>
        <div
          className={itemClassName}
          data-state={view === 'downloading' ? 'active' : 'inactive'}
          onClick={() => setView('downloading')}
        >
          下载中
        </div>
        <div
          className={itemClassName}
          data-state={view === 'done' ? 'active' : 'inactive'}
          onClick={() => setView('done')}
        >
          已完成
        </div>
        <Separator />
        <div
          className={itemClassName}
          data-state={view === 'setting' ? 'active' : 'inactive'}
          onClick={() => setView('setting')}
        >
          设置
        </div>
      </div>
      <div className="pl-48">{view === 'setting' ? <Settings /> : <Torrents />}</div>
    </>
  );
}

export default App;
