import { type ReactNode, type UIEvent, useEffect, useRef, useState } from 'react';

interface Props<T> {
  listData: T[];
  itemHeight: number;
  children: (item: T, index: number) => ReactNode;
}

function useThrottle(time = 100) {
  const { current } = useRef<{ timer: number | null }>({ timer: null });

  return (fn: () => void) => {
    if (current.timer) {
      return;
    }
    current.timer = window.setTimeout(() => {
      fn();
      current.timer = null;
    }, time);
  };
}

function VirtualizedList<T>(props: Props<T>) {
  const { listData, itemHeight, children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  // 记录滚动掉的高度
  const [scrollOffset, setScrollOffset] = useState(0);
  const [offset, setOffset] = useState(0);

  const listCount = listData.length;
  const listHeight = listCount * itemHeight;

  useEffect(() => {
    const height = containerRef.current?.offsetHeight ?? 0;
    setContainerHeight(height);
  }, []);

  const renderItem = () => {
    if (!listCount) return null;
    // 可视区起始索引
    const startIndex = Math.floor(scrollOffset / itemHeight);
    // 上缓冲区起始索引
    const finialStartIndex = Math.max(0, startIndex - 2);
    // 可视区能展示的元素的最大个数
    const numVisible = Math.floor(containerHeight / itemHeight);
    // 下缓冲区结束索引
    const endIndex = Math.min(listCount, startIndex + numVisible + 2);

    const items = [];

    const _offset = finialStartIndex * itemHeight;

    if (_offset != offset) {
      setOffset(finialStartIndex * itemHeight);
    }

    for (let i = finialStartIndex; i < endIndex; i++) {
      const item = listData[i];
      items.push(children(item, i));
    }
    return items;
  };

  const scroll = useThrottle();

  const scrollHandle = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;

    scroll(() => setScrollOffset(scrollTop));
  };

  return (
    <div ref={containerRef} className="overflow-auto h-full relative" onScroll={scrollHandle}>
      <div style={{ height: listHeight + 'px', zIndex: '-1', width: '10px', position: 'absolute' }}></div>
      <div style={{ transform: 'translateY(' + offset + 'px)' }}>{renderItem()}</div>
    </div>
  );
}

export default VirtualizedList;
