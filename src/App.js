import './components/BitBox';
import './App.css';
import { BitList } from './BitList';
import React, { useRef } from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { numberWithCommas } from './utils';

function App() {
  function forceUpdate() {
    setValue(stateRef.current + 1);
    console.log(list, '-----------------------------------------');
  }

  const stateRef = useRef();
  const [list, setList] = React.useState(new BitList(''));
  const [activeInput, setActiveInput] = React.useState(false);
  const [value, setValue] = React.useState(0); // integer state
  stateRef.current = value;

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
    window.addEventListener('keydown', handleKeyInput);

    return () => {
      window.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  React.useEffect(() => {
    const observer = new MutationObserver(forceUpdate);
    observer.observe(document.getElementById('updater'), {
      characterData: false,
      attributes: false,
      childList: true,
      subtree: false,
    });
  }, []);

  return (
    <div className='App'>
      <div id='updater'>1</div>
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
            Copy all
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
