import { useState, useEffect } from "react";
import type { SessionStats } from "@/types/rpc";
import { getSessionStats } from "@/utils/rpc";
import { formatSize } from "@/utils/format";

function Stats() {
  const [stats, setStats] = useState<SessionStats>();
  const init = async () => {
    const data = await getSessionStats();
    setStats(data.arguments);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-2">
      <div>
        总计：
        <div>
          <span>已上传：</span>
          {formatSize(stats?.['cumulative-stats'].uploadedBytes ?? 0)}
        </div>
        <div>
          <span>已下载：</span>
          {formatSize(stats?.['cumulative-stats'].downloadedBytes ?? 0)}
        </div>
        <div>
          <span>会话次数：</span>
          {stats?.['cumulative-stats'].sessionCount}
        </div>
        <div>
          <span>活动时间：</span>
          {stats?.['cumulative-stats'].secondsActive}
        </div>
      </div>
      <div>
        自启动以来：
        <div>
          <span>已上传：</span>
          {formatSize(stats?.['current-stats'].uploadedBytes ?? 0)}
        </div>
        <div>
          <span>已下载：</span>
          {formatSize(stats?.['current-stats'].downloadedBytes ?? 0)}
        </div>
        <div>
          <span>会话次数：</span>
          {stats?.['current-stats'].sessionCount}
        </div>
        <div>
          <span>活动时间：</span>
          {stats?.['current-stats'].secondsActive}
        </div>
      </div>
    </div>
  );
}

export default Stats;