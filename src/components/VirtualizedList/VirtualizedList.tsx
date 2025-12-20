import { type ReactNode, type UIEvent, useEffect, useRef, useState } from 'react';

interface Props<T> {
  listData: T[];
  itemHeight: number;
  children: (item: T, index: number) => ReactNode;
}

/**
 * 虚拟滚动列表
 * @param props
 * @returns
 */
function VirtualizedList<T>(props: Props<T>) {
  const { listData, itemHeight, children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  // 记录滚动掉的高度
  const [scrollOffset, setScrollOffset] = useState(0);

  const listCount = listData.length;
  const listHeight = listCount * itemHeight;

  // 初始化
  useEffect(() => {
    if (!containerRef.current) return;

    // 使用 ResizeObserver 监听高度变化
    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 可视区起始索引
  const startIndex = Math.floor(scrollOffset / itemHeight);
  // 上缓冲区起始索引
  const finialStartIndex = Math.max(0, startIndex - 2);
  // 可视区能展示的元素的最大个数
  const numVisible = Math.floor(containerHeight / itemHeight);
  // 下缓冲区结束索引
  const endIndex = Math.min(listCount, startIndex + numVisible + 2);

  const items = [];

  const currentOffset = finialStartIndex * itemHeight;

  for (let i = finialStartIndex; i < endIndex; i++) {
    const item = listData[i];
    items.push(children(item, i));
  }

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    window.requestAnimationFrame(() => setScrollOffset(scrollTop));
  };

  return (
    <div ref={containerRef} className="overflow-auto h-full relative" onScroll={onScroll}>
      <div style={{ height: listHeight + 'px', zIndex: '-1', width: '10px', position: 'absolute' }}></div>
      <div style={{ transform: `translateY(${currentOffset}px)` }}>{items}</div>
    </div>
  );
}

export default VirtualizedList;
