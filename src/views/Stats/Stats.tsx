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
          已上传：
          {formatSize(stats?.["cumulative-stats"].uploadedBytes ?? 0)}
        </div>
        <div>
          已下载：
          {formatSize(stats?.["cumulative-stats"].downloadedBytes ?? 0)}
        </div>
      </div>
      <div>
        自启动以来：
        <div>
          已上传：
          {formatSize(stats?.["current-stats"].uploadedBytes ?? 0)}
        </div>
        <div>
          已下载：
          {formatSize(stats?.["current-stats"].downloadedBytes ?? 0)}
        </div>
      </div>
    </div>
  );
}

export default Stats;