import './components/BitBox';
import './App.css';
import { BitList } from './BitList';
import React from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { numberWithCommas } from './utils';

function App() {
  function forceUpdate() {
    setValue(value + 1);
  }

  const [list, setList] = React.useState(new BitList('', forceUpdate));
  const [activeInput, setActiveInput] = React.useState(false);
  const [value, setValue] = React.useState(0); // integer state

  const handleActiveInput = React.useCallback((e) => {
    setActiveInput(true);
  }, []);

  const handleClearClick = React.useCallback(
    (e) => {
      list.clear();

      forceUpdate();
    },
    [list, value]
  );

  const handleInvertClick = React.useCallback(
    (e) => {
      list.invert();
      console.log(list, '-----------------------------------------');

      forceUpdate();
    },
    [list, value]
  );

  const handleKeyInput = React.useCallback(
    (e) => {
      const numRegex = new RegExp('^[01]$');
      if (activeInput) {
        if (numRegex.test(parseInt(e.key))) {
          list.addSaveToList(true, e.key, false);
        } else if (e.which == 39) {
          //right
          list.moveCursor(false);
        } else if (e.which == 37) {
          //left
          list.moveCursor(true);
        } else if (e.which == 8) {
          list.deleteSaveFromList();
        }
        console.log(list, '-----------------------------------------');
        forceUpdate();
      }
    },
    [activeInput, value, list]
  );

  React.useEffect(() => {
    console.log(list, '-----------------------------------------');

    window.addEventListener('keydown', handleKeyInput);

    return () => {
      window.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  return (
    <div className='App'>
      <div className='mb-4'>
        <span className='mr-6'>
          Hex: <span className='font-bold'>0x</span>
          <span className='uppercase font-bold'>{list.getHexValue()}</span>
        </span>
        <span className='mr-6'>
          Decimal:{' '}
          <span className='uppercase font-bold'>
            {numberWithCommas(list.getDecValue())}
          </span>
        </span>
        <button
          onClick={handleClearClick}
          className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'
        >
          Clear
        </button>

        <CopyToClipboard text={list.bitString}>
          <button className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'>
            Copy to clipboard
          </button>
        </CopyToClipboard>

        <button
          onClick={handleInvertClick}
          className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded'
        >
          Invert
        </button>
      </div>
      <div
        className={classNames(
          'bit_container border-2 p-1 flex justify-start items-center cursor-text',
          {
            'border-black': activeInput,
            'border-grey-100': !activeInput,
          }
        )}
        onClick={handleActiveInput}
      >
        {list.render()}
        {list.renderBitNumbers()}
        {list.renderBytes()}
        {list.renderValues()}
        {list.renderByteButtons()}
      </div>
    </div>
  );
}

export default App;
