import React from 'react';
import classNames from 'classnames';

export default function BitBox({ bit, ac }) {
  const [active] = React.useState(ac);
  return (
    <div
      className={classNames(
        'inline-block rounded-md text-white font-extrabold text-center px-2 py-2 mr-2',
        { 'bg-blue-600': !active, 'bg-green-600': active }
      )}
    >
      {bit}
    </div>
  );
}
