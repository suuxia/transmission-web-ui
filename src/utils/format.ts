import dayjs from 'dayjs';

/**
 * 根据文件大小格式化容量
 * @param size
 */
export function formatSize(size: number) {
  const sizeName = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  for (let i = 0; i < sizeName.length; i++) {
    if (size < 1024) {
      return parseFloat(size.toFixed(2)) + sizeName[i];
    }

    size = size / 1024;
  }

  return size;
}

/**
 * 格式化日期
 * @param time
 * @param fmt
 */
export function formatDateTime(time?: number, fmt = 'YYYY/MM/DD HH:mm:ss') {
  if (!time) return '';
  return dayjs.unix(time).format(fmt);
}

const percentFormatter = new Intl.NumberFormat('default', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * 格式化百分比
 * @param value
 */
export function formatPercent(value: number) {
  return percentFormatter.format(value);
}
