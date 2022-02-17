import "./BitListBox.css";
import React, { useRef, useDebugValue } from "react";
import { BitList } from "../BitList";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classNames from "classnames";
import { numberWithCommas } from "../utils";

function useStateWithLabel(initialValue, name) {
  const [value, setValue] = React.useState(initialValue);
  useDebugValue(`${name}: ${value}`);
  return [value, setValue];
}

function BitListBox() {
  function forceUpdate() {
    setValue(stateRef.current + 1);
    setDisplayValue("hex", list.getHexValue().toUpperCase());
    setDisplayValue("dec", numberWithCommas(list.getDecValue()));
  }

  const stateRef = useRef();
  const [hexVal, setHexVal] = React.useState("0x-");
  const [decVal, setDecVal] = useStateWithLabel("-", "decVal");
  const [fill, setFill] = React.useState(false);
  const [complement, setComplement] = React.useState(false);
  const [complementRepresentation, setComplementRepresentation] =
    React.useState(false);
  const [stickyCursor, setStickyCursor] = React.useState(false);
  const [fillWith, setFillWith] = React.useState("0");
  const [activeInput, setActiveInput] = React.useState(false);
  const [value, setValue] = React.useState(0); // integer state
  const [list] = React.useState(
    new BitList("", fill, stickyCursor, complement)
  );
  stateRef.current = value;

  const handleActiveInput = React.useCallback(() => {
    setActiveInput(true);
  }, []);

  const handleClearClick = React.useCallback(() => {
    list.clear();

    forceUpdate();
  }, [list, value]);

  const handleInvertClick = React.useCallback(() => {
    list.invert();

    forceUpdate();
  }, [list, value]);

  const checkClipBoardWithCallback = (callback) => {
    navigator.clipboard.readText().then((clipText) => {
      const numMultipleRegex = new RegExp("^[01]*$");
      const clipboardText = clipText;
      if (numMultipleRegex.test(clipboardText)) {
        callback(clipboardText.toString());
      }

      forceUpdate();
    });
  };

  const handlePasteClick = React.useCallback(() => {
    const callback = (str) => {
      list.paste(str);
    };
    checkClipBoardWithCallback(callback);
  }, [list, value]);

  const handlePasteAndClearClick = React.useCallback(async () => {
    const callback = (str) => {
      list.clearAndPaste(str);
    };
    checkClipBoardWithCallback(callback);
  }, [list, value]);

  const handleFillChange = React.useCallback(() => {
    setFill(!fill);
    list.changeFilling(!fill ? fillWith : "-1");
    forceUpdate();
  });

  const handleFillWithChange = React.useCallback((e) => {
    const target = e.target;
    setFillWith(target.value);
    list.changeFilling(target.value);
    forceUpdate();
  });

  const handleComplementRepresentation = React.useCallback((e) => {
    const target = e.target;
    setComplementRepresentation(target.value === "true");
    list.changeComplementRepresentation(target.value === "true");
    forceUpdate();
  });

  const handleStickyCursorChange = React.useCallback(() => {
    setStickyCursor(!stickyCursor);
    list.changeStickyCursor(!stickyCursor);
    forceUpdate();
  });

  const handleComplementChange = React.useCallback(() => {
    setComplement(!complement);
    list.changeComplement(!complement);
    forceUpdate();
  });

  //   const handleValueChange = React.useCallback((e, target) => {
  //     list.override(target, e.target.value);
  //   });

  const setDisplayValue = (target, val) => {
    switch (target) {
      case "hex":
        setHexVal("0x" + val);
        break;
      case "dec":
        setDecVal(val);
        break;
    }
  };

  const handleKeyInput = React.useCallback(
    (e) => {
      const numRegex = new RegExp("^[01]*$");
      if (activeInput) {
        if (numRegex.test(parseInt(e.key))) {
          list.addSaveToList(true, e.key, 0);
        } else if (e.which === 39) {
          //right
          list.moveCursor(false);
        } else if (e.which === 37) {
          //left
          list.moveCursor(true);
        } else if (e.which === 8) {
          list.deleteSaveFromList();
        }
        // console.log(list, '-----------------------------------------');
        forceUpdate();
      }
    },
    [activeInput, value, list]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyInput);

    return () => {
      window.removeEventListener("keydown", handleKeyInput);
    };
  }, [handleKeyInput]);

  React.useEffect(() => {
    const observer = new MutationObserver(forceUpdate);
    observer.observe(document.getElementById("updater"), {
      characterData: false,
      attributes: false,
      childList: true,
      subtree: false,
    });
  }, []);

  return (
    <div className="App">
      <div id="updater">1</div>
      <div className="mb-4 controls">
        <span className="mr-6">
          Hex:
          <input
            className="textbox_val font-bold"
            type="text"
            value={hexVal}
            disabled
          />
        </span>
        <span className="mr-6">
          Dec:{" "}
          <input
            className="uppercase textbox_val font-bold"
            type="text"
            value={decVal}
            disabled
          />
        </span>
        <button
          onClick={handlePasteClick}
          className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded"
        >
          Paste
        </button>
        <button
          onClick={handlePasteAndClearClick}
          className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded"
        >
          Clear & Paste
        </button>
        <button
          onClick={handleClearClick}
          className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded"
        >
          Clear
        </button>

        <CopyToClipboard text={list.getBitString(true)}>
          <button className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded">
            Copy all
          </button>
        </CopyToClipboard>

        <button
          onClick={handleInvertClick}
          className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 cursor-pointer rounded"
        >
          Invert
        </button>
        <div className={`fillerBox box ${fill ? "" : "grey"}`}>
          <input
            name="fill"
            type="checkbox"
            checked={fill}
            onChange={handleFillChange}
          />
          Fill with:
          <select
            value={fillWith}
            onChange={handleFillWithChange}
            disabled={!fill}
          >
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
        <div className={`fillerBox box ${stickyCursor ? "" : "grey"}`}>
          <input
            name="fill"
            type="checkbox"
            checked={stickyCursor}
            onChange={handleStickyCursorChange}
          />
          Sticky Cursor
        </div>
        <div className={`fillerBox box ${complement ? "" : "grey"} complement`}>
          <input
            name="fill"
            type="checkbox"
            checked={complement}
            onChange={handleComplementChange}
          />
          <select
            value={complementRepresentation}
            onChange={handleComplementRepresentation}
            disabled={!complement}
          >
            <option value={false}>Two's</option>
            <option value={true}>One's</option>
          </select>
          complement
        </div>
      </div>
      <div
        className={classNames(
          "bit_container border-2 p-1 flex justify-start items-center cursor-text",
          {
            "border-black": activeInput,
            "border-grey-100": !activeInput,
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

export default BitListBox;
