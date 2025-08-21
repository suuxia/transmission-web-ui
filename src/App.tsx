import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';
import type { SessionStats } from '@/types/rpc.ts';
import { getSessionStats } from '@/utils/rpc.ts';

function App() {
  const [sessionStats, setSessionStats] = useState<SessionStats>();

  const itemClassName = ' py-2 rounded-md hover:bg-gray-200';

  const setClassName = ({ isActive }: { isActive: boolean }) => {
    return `${itemClassName}${isActive ? ' bg-gray-200' : ''}`;
  };

  useEffect(() => {
    const init = async () => {
      const data = await getSessionStats();
      setSessionStats(data.arguments);
    };

    init();
  }, []);

  const doneNumber = () => {
    const { torrentCount = 0, activeTorrentCount = 0 } = sessionStats || {};
    return torrentCount - activeTorrentCount;
  };

  return (
    <>
      <nav className="fixed flex flex-col w-48 h-dvh p-2 gap-2 border-r-1 select-none text-center border-slate-200">
        <NavLink className={setClassName} to="/">
          全部 ({sessionStats?.torrentCount})
        </NavLink>
        <NavLink className={setClassName} to="/downloading">
          下载中 ({sessionStats?.activeTorrentCount})
        </NavLink>
        <NavLink className={setClassName} to="/done">
          已完成 ({doneNumber()})
        </NavLink>
        <Separator />
        <NavLink className={setClassName} to="/settings">
          设置
        </NavLink>
        <NavLink className={setClassName} to="/about">
          关于
        </NavLink>
      </nav>
      <div className="pl-48 h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;
