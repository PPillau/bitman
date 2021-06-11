import './components/BitBox';
import './App.css';
import { BitList } from './BitList';
import React from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ByteRuler from './components/ByteRuler';
import ByteValueLabels from './components/ByteValueLabels';

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
    console.log(list, '-----------------------------------------');

    window.addEventListener('keydown', handleKeyInput);

    return () => {
      window.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  return (
    <div className='App'>
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
        <ByteRuler>2</ByteRuler>
        <ByteRuler>1</ByteRuler>
        <ByteValueLabels hex='-' dec='-'></ByteValueLabels>
        <ByteValueLabels hex='5B' dec='181'></ByteValueLabels>
      </div>
    </div>
  );
}

export default App;
