import type { ReactNode } from 'react';

interface Props {
  prefix?: ReactNode;
  type?: string;
}

function Input({ type, prefix }: Props) {
  return (
    <div className='flex items-center px-3 gap-2 border border-gray-300 rounded-md'>
      { prefix }
      <input
        className='outline-none text-sm'
        type={type}
      />
    </div>
  );
}

export { Input };