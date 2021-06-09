import './components/BitBox';
import './App.css';
import BitBox from './components/BitBox';
import React from 'react';
import classNames from 'classnames';

function App() {
  const [activeInput, setActiveInput] = React.useState(false);
  const [bitContent, setBitContent] = React.useState('');
  const [hexContent, setHexContent] = React.useState('');
  const [decContent, setDecContent] = React.useState('');
  const [content, setContent] = React.useState([]);

  const handleActiveInput = React.useCallback((e) => {
    setActiveInput(true);
  }, []);

  const handleKeyInput = React.useCallback(
    (e) => {
      const numRegex = new RegExp('^[01]$');
      console.log(
        activeInput && numRegex.test(parseInt(e.key)),
        e.key,
        activeInput,
        numRegex.test(parseInt(e.key)),
        '-----------------------------------------'
      );
      if (activeInput && numRegex.test(parseInt(e.key))) {
        let temp = bitContent + e.key;
        setBitContent(temp);
        setHexContent(parseInt(temp, 2).toString(16));
        setDecContent(parseInt(temp, 2).toString(10));
        setContent([
          ...content,
          <BitBox key={content.length} bit={e.key} active={false}></BitBox>,
        ]);
      }
    },
    [activeInput, content, bitContent, hexContent]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyInput);

    return () => {
      window.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  return (
    <div className='App'>
      <div
        className={classNames(
          'border-2 h-20 p-1 flex justify-start items-center',
          {
            'border-black': activeInput,
            'border-grey-100': !activeInput,
          }
        )}
        onClick={handleActiveInput}
      >
        {content}
      </div>
      <div className='text-2xl'>
        {' '}
        <span className='mr-6'>
          Hex: <span className='font-bold'>0x</span>
          <span className='uppercase font-bold'>{hexContent}</span>
        </span>
        <span className='mr-6'>
          Decimal: <span className='uppercase font-bold'>{decContent}</span>
        </span>
      </div>
    </div>
  );
}

export default App;
