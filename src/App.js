import './components/BitBox';
import './App.css';
import BitBox from './components/BitBox';
import React from 'react';
import classNames from 'classnames';

function App() {
  const [activeInput, setActiveInput] = React.useState(false);
  const [content, setContent] = React.useState([
    <BitBox key='0' bit='1' active={true}></BitBox>,
  ]);

  const handleActiveInput = (e) => {
    setActiveInput(true);
  };

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
        setContent([
          ...content,
          <BitBox key={content.length} bit={e.key} active={false}></BitBox>,
        ]);
      }
    },
    [activeInput, content]
  );

  React.useEffect(() => {
    document.body.addEventListener('keypress', handleKeyInput);
  }, []);

  return (
    <div className='App'>
      <div
        className={classNames('border-2 p-1 flex justify-start', {
          'border-black': activeInput,
          'border-grey-100': !activeInput,
        })}
        onClick={handleActiveInput}
      >
        {content}
      </div>
    </div>
  );
}

export default App;
