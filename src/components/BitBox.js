import React from 'react';
import classNames from 'classnames';

export default function BitBox({ bit, ac, children, cursorToLeft = false }) {
  const [active] = React.useState(ac);
  return (
    <div className='cell bit'>
      {cursorToLeft && children}
      <span
        className={classNames(
          'flex inline-block justify-center rounded-md items-center text-white font-extrabold text-center h-12 w-8 px-2 py-2',
          { 'bg-blue-600': !active, 'bg-green-600': active }
        )}
      >
        {bit}
        {!cursorToLeft && children}
      </span>
    </div>
  );
}
