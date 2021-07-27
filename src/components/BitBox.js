import React from 'react';

export default function BitBox({ bit, color, children, cursorToLeft = false }) {
  const colorList = ['bg-blue-600', 'bg-gray-600', 'bg-green-600'];
  return (
    <div className='cell bit'>
      {cursorToLeft && children}
      <span
        className={`${colorList[color]} flex inline-block cursor-pointer justify-center rounded-md items-center text-white font-extrabold text-center h-12 w-8 px-2 py-2`}
      >
        {bit}
        {!cursorToLeft && children}
      </span>
    </div>
  );
}
