import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Torrents from "@/views/torrents.tsx";

function App() {
  const [view, setView] = useState('all');
  return (
    <>
      <div className="fixed flex flex-col w-40 h-dvh p-2 gap-2 border-r-1 border-slate-200">
        <div
          className='select-none text-center py-1 rounded-md hover:bg-gray-200'
          onClick={() => setView('all')}
        >全部</div>
        <div
          className='select-none text-center py-1 rounded-md hover:bg-gray-200'
          onClick={() => setView('downloading')}
        >下载中</div>
        <div
          className='select-none text-center py-1 rounded-md hover:bg-gray-200'
          onClick={() => setView('done')}
        >已完成</div>
        <Separator />
        <div
          className='select-none text-center py-1 rounded-md hover:bg-gray-200'
          onClick={() => setView('setting')}
        >
          设置
        </div>
      </div>
      <div className="pl-40">
        {view}
        <Torrents />
      </div>
    </>
  )
}

export default App
