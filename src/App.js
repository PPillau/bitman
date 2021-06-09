import './components/BitBox';
import './App.css';
import BitBox from './components/BitBox';
import React from 'react';
import classNames from 'classnames';

function App() {
  const cursor = <span key='-1' className='cursor h-12'></span>;
  const [cursorPos, setCursorPos] = React.useState(1);
  const [activeInput, setActiveInput] = React.useState(false);
  const [bitContent, setBitContent] = React.useState('');
  const [hexContent, setHexContent] = React.useState('');
  const [asciiContent, setAsciiContent] = React.useState('');
  const [decContent, setDecContent] = React.useState('');
  const [content, setContent] = React.useState([cursor]);

  const handleActiveInput = React.useCallback((e) => {
    setActiveInput(true);
  }, []);

  const handleClearClick = React.useCallback(
    (e) => {
      setContent([cursor]);
      setCursorPos(1);
      setBitContent('');
      setHexContent('');
      setDecContent('');
    },
    [content, bitContent, hexContent, cursorPos, cursor]
  );

  const handleInvertClick = React.useCallback(
    (e) => {
      let temp = [];
      let temp2 = '';
      for (let i = 0; i < bitContent.length; i++) {
        if (bitContent.charAt(i) == '0') {
          temp2 += '1';
          if (cursorPos - 1 == i) {
            temp.push(cursor);
          } else {
            temp.push(<BitBox key={i} bit='1' active={false}></BitBox>);
          }
        } else {
          temp2 += '0';
          if (cursorPos - 1 == i) {
            temp.push(cursor);
          } else {
            temp.push(<BitBox key={i} bit='0' active={false}></BitBox>);
          }
        }
      }
      setContent(temp);
      setBitContent(temp2);
      setHexContent(parseInt(temp2, 2).toString(16));
      setDecContent(parseInt(temp2, 2).toString(10));
    },
    [content, bitContent, hexContent, cursorPos, cursor]
  );

  const handleKeyInput = React.useCallback(
    (e) => {
      const addInString = (str, pos, bit) => {
        return str.substr(0, pos) + bit + str.substr(pos, str.length);
      };
      const deleteFromString = (str, pos) => {
        return str.substr(0, pos - 1) + str.substr(pos, str.length);
      };
      const numRegex = new RegExp('^[01]$');
      if (activeInput) {
        if (numRegex.test(parseInt(e.key))) {
          let temp = addInString(bitContent, cursorPos - 1, e.key);
          setBitContent(temp);
          setHexContent(parseInt(temp, 2).toString(16));
          setDecContent(parseInt(temp, 2).toString(10));
          setAsciiContent(String.fromCharCode(parseInt(temp, 2)));
          let temp2 = content;
          temp2.splice(
            cursorPos - 1,
            0,
            <BitBox key={content.length} bit={e.key} active={false}></BitBox>
          );
          setContent(temp2);
          setCursorPos(cursorPos + 1);
        } else if (e.which == 39) {
          //right
          if (cursorPos + 1 <= content.length) {
            let temp = content;
            let temp2 = cursorPos - 1;
            temp.splice(temp2, 1);
            temp.splice(cursorPos, 0, cursor);
            setCursorPos(cursorPos + 1);
            setContent(temp);
          }
        } else if (e.which == 37) {
          //left
          if (cursorPos - 1 > 0) {
            let temp = content;
            let temp2 = cursorPos - 1;
            temp.splice(temp2, 1);
            temp.splice(cursorPos - 2, 0, cursor);
            setCursorPos(temp2);
            setContent(temp);
          }
        } else if (e.which == 8) {
          if (cursorPos > 1) {
            let temp = content;
            let temp2 = deleteFromString(bitContent, cursorPos - 1);
            temp.splice(cursorPos - 2, 1);
            setContent(temp);
            setBitContent(temp2);
            setHexContent(parseInt(temp2, 2).toString(16));
            setDecContent(parseInt(temp2, 2).toString(10));
            setAsciiContent(String.fromCharCode(parseInt(temp2, 2)));
            setCursorPos(cursorPos - 1);
          }
        }
      }
    },
    [
      activeInput,
      content,
      bitContent,
      hexContent,
      asciiContent,
      cursorPos,
      cursor,
    ]
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
        <span className='mr-6'>
          ASCII: <span className='uppercase font-bold'>{asciiContent}</span>
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
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Invert
        </button>
      </div>
    </div>
  );
}

export default App;
