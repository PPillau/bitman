import BitBox2 from './components/BitBox2';
import './components/BitBox';
import './App.css';
import { BitList } from './BitList';
import React from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function App() {
  const [list, setList] = React.useState(new BitList(''));
  const [activeInput, setActiveInput] = React.useState(false);
  const [value, setValue] = React.useState(0); // integer state

  function forceUpdate() {
    setValue(value + 1);
  }

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
    window.addEventListener('keydown', handleKeyInput);

    return () => {
      window.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  return (
    <div className='App'>
      <div
        className={classNames(
          'border-2 h-20 p-1 flex justify-start items-center cursor-pointer',
          {
            'border-black': activeInput,
            'border-grey-100': !activeInput,
          }
        )}
        onClick={handleActiveInput}
      >
        {list.render()}
      </div>
      <div className='text-2xl'>
        {' '}
        <span className='mr-6'>
          Hex: <span className='font-bold'>0x</span>
          <span className='uppercase font-bold'>{list.getHexValue()}</span>
        </span>
        <span className='mr-6'>
          Decimal:{' '}
          <span className='uppercase font-bold'>{list.getDecValue()}</span>
        </span>
        <span className='mr-6'>
          Unicode:{' '}
          <span className='uppercase font-bold'>{list.getUnicodeValue()}</span>
        </span>
      </div>
      <div>
        <button
          onClick={handleClearClick}
          className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 rounded'
        >
          Clear
        </button>
        <button
          onClick={handleInvertClick}
          className='bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 rounded'
        >
          Invert
        </button>
        <CopyToClipboard text={list.bitString}>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Copy to clipboard
          </button>
        </CopyToClipboard>
      </div>

      <div
        className={classNames(
          'bit_container border-2 mt-10 p-1 flex justify-start items-center cursor-pointer'
        )}
      >
        <div className='cell bit filler'></div>

        <div className='cell bit'>
          <BitBox2 bit='0'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='0'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='0'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='0'></BitBox2>
        </div>
        <div className='cell bit'>
          <BitBox2 bit='1'></BitBox2>
        </div>
        <div className='cell bit_number filler'></div>

        <div className='cell bit_number'>10</div>
        <div className='cell bit_number'>9</div>
        <div className='cell bit_number'>8</div>
        <div className='cell bit_number'>7</div>
        <div className='cell bit_number'>6</div>
        <div className='cell bit_number'>5</div>
        <div className='cell bit_number'>4</div>
        <div className='cell bit_number'>3</div>
        <div className='cell bit_number'>2</div>
        <div className='cell bit_number'>1</div>
        <div className='cell byte_ruler left-border'>
          <span className='byte_label'>Byte 2</span>
        </div>
        <div className='cell byte_ruler right-border'>
          <span className='byte_label'>Byte 1</span>
        </div>
        <div className='cell value_labels'>
          <span className='mx-5'>
            Hex: <span className='font-bold'>0x</span>
            <span className='uppercase font-bold'>-</span>
          </span>
          <span className='mx-5'>
            Dec: <span className='font-bold'>-</span>
          </span>
        </div>
        <div className='cell value_labels'>
          <span className='mx-5'>
            Hex: <span className='font-bold'>0x</span>
            <span className='uppercase font-bold'>B5</span>
          </span>
          <span className='mx-5'>
            Dec: <span className='font-bold'>181</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
