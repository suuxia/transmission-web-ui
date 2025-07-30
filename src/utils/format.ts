/**
 * 根据文件大小格式化容量
 * @param size
 */
export function formatSize(size: number) {
  const sizeName = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  for (let i = 0; i < sizeName.length; i++) {
    if (size < 1024) {
      return size.toFixed(2) + sizeName[i];
    }

    size =  size / 1024;
  }

  return size;
}