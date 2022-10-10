import { createRef, useCallback, useEffect } from "react";
import useState from "react-usestateref";
import "./BitList.css";
import Bit from "./Bit.js";
import DragSelect from "dragselect";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCopy,
  faRepeat,
  faArrowRight,
  faArrowLeft,
  faArrowsLeftRightToLine,
  faICursor,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Dropdown from "react-dropdown";

const BitList = ({ areaId = 0, initialBitString, filler = "0" }) => {
  const [cursorPosition, setCursorPosition, refCursorPosition] = useState(0);
  const [bitString, setBitString, refBitString] = useState(initialBitString);
  const [dragSelector, setDragSelector, refDragSelector] = useState({});
  const [selection, setSelection] = useState([]);

  const [stickyCursor, setStickyCursor] = useState(false);
  const [fill, setFill] = useState(false);
  const [fillWith, setFillWith] = useState(filler);
  const [decValue, setDecValue] = useState("");
  const [hexValue, setHexValue] = useState("");

  const bitInputRef = createRef();

  /* ----------------- START list management ----------------- */

  /* --- START getters --- */
  const getBitString = (filled) => {
    if (filled && fillWith !== "" && bitString.length > 0) {
      const fillAmount = 8 - (refBitString.current.length % 8);

      if (fillAmount === 8) {
        return bitString;
      }

      return _.padStart(bitString, bitString.length + fillAmount, fillWith);
    } else {
      return bitString;
    }
  };

  const getByteStartPosition = useCallback(
    (byteNumber) => {
      const unfinished = bitString.length % 8;
      const lateStart = unfinished > 0 ? -1 : 0;

      return byteNumber === 0 ? 0 : unfinished + (byteNumber + lateStart) * 8;
    },
    [bitString]
  );

  const getByteEndPosition = (byteNumber) => {
    const earlyEnd = getWrappedAroundUnfinished();

    return earlyEnd + 8 * byteNumber;
  };

  const getWrappedAroundUnfinished = useCallback(() => {
    const unfinished = bitString.length % 8;

    return unfinished === 0 ? 8 : unfinished;
  }, [bitString]);

  const getByte = (pos, withFiller = true) => {
    const actualBitString = getBitString(withFiller);
    if (Math.ceil(actualBitString.length / 8) < pos) {
      return "";
    }

    let cropStart = 0;
    let cropEnd = 0;

    if (withFiller) {
      cropStart = pos * 8;
      cropEnd = (pos + 1) * 8;
    } else {
      cropStart = getByteStartPosition(pos);
      cropEnd = getByteEndPosition(pos);
    }

    return actualBitString.substring(cropStart, cropEnd);
  };

  const getBitSectionFillAmount = useCallback(() => {
    const fillAmount = refBitString.current.length % 8;
    const byteAmount = refBitString.current.length / 8;

    return (Math.floor(byteAmount) * 8 + fillAmount) * 5;
  }, [refBitString]);

  /* --- END getters --- */

  const moveCursorToEnd = useCallback(() => {
    moveCursor(refBitString.current.length * 2);
  }, [cursorPosition]);

  const moveCursor = (pos) => {
    if (pos < 0 || pos > refBitString.current.length * 2 || pos % 2 !== 0) {
      return;
    }
    document.getElementById(`bitElement_${pos}`).focus();
  };

  const deleteAllFromList = useCallback(() => {
    setBitString("");
  }, [setBitString, setCursorPosition]);

  const deleteFromListAt = useCallback(
    (start, end) => {
      let resultingBitString = bitString;

      resultingBitString =
        resultingBitString.substr(0, start) +
        resultingBitString.substr(end, getBitString(false).length);

      setBitString(resultingBitString);
      setCursorPosition(0);
      moveCursor(0);
    },
    [bitString, setBitString, setCursorPosition]
  );

  const changeToNewStringAt = useCallback(
    (newBitString, pos) => {
      let resultingBitString = bitString;

      resultingBitString =
        resultingBitString.substr(0, pos) +
        newBitString +
        resultingBitString.substr(
          pos + newBitString.length,
          getBitString(false).length
        );

      setBitString(resultingBitString);
    },
    [bitString, setBitString]
  );

  const moveByte = useCallback((byteNumber, direction, e = null) => {
    if (e !== null) {
      e.stopPropagation();
    }

    let resultingBitString = bitString;
    const byteDirection = direction ? -1 : 1;

    const movedByte = getByte(byteNumber);
    const replacementByte = getByte(byteNumber + byteDirection);

    const movedByteStartPosition = getByteStartPosition(byteNumber);
    const replacementByteStartPosition = getByteStartPosition(
      byteNumber + byteDirection
    );
    const replacementdByteEndPosition = getByteEndPosition(
      byteNumber + byteDirection
    );

    if (direction) {
      //move left

      resultingBitString =
        resultingBitString.substr(0, replacementByteStartPosition) +
        movedByte +
        replacementByte +
        resultingBitString.substr(
          replacementByteStartPosition +
            movedByte.length +
            replacementByte.length,
          resultingBitString.length
        );
    } else {
      //move right

      resultingBitString =
        resultingBitString.substr(0, movedByteStartPosition) +
        replacementByte +
        movedByte +
        resultingBitString.substr(
          replacementdByteEndPosition,
          resultingBitString.length
        );
    }

    setBitString(resultingBitString);
  });

  /* ----------------- END list management ----------------- */

  /* ----------------- START UI callbacks ----------------- */

  const copyAllFromListToClipboard = useCallback(() => {
    navigator.clipboard.writeText(getBitString(true));
  }, [bitString]);

  const copyByteToClipboad = (byteNumber) => {
    navigator.clipboard.writeText(getByte(byteNumber));
  };

  const handleFillChange = useCallback(() => {
    setFill(!fill);
  }, [setFill, fill]);

  const handleStickyCursorChange = useCallback(() => {
    setStickyCursor(!stickyCursor);
  }, [setStickyCursor, stickyCursor]);

  const handleFillWithChange = useCallback(
    (option) => {
      setFillWith(option.value);
    },
    [setFillWith]
  );

  const handleDecTextChange = useCallback(
    (e) => {
      setDecValue(formatDecimal(e.target.value));
    },
    [setDecValue]
  );

  const handleBitInputChange = useCallback(
    (e) => {
      const localBitString = e.currentTarget.value;

      setBitString(localBitString);
    },
    [refBitString, setBitString]
  );

  /* ----------------- END UI callbacks ----------------- */

  /* ----------------- START use effects & management ----------------- */

  //Initializer
  useEffect(() => {
    const dragSelect = new DragSelect({
      selectables: document.getElementsByClassName("selectable_bits"),
      area: document.getElementById(`bitlist_box_area_${areaId}`),
      draggability: false,
    });
    dragSelect.subscribe("callback", onSelection);
    setDragSelector(dragSelect);
  }, []);

  useEffect(() => {
    const actualBitString = getBitString(fill);
    const bitDecStringValue = getDecValueBasic(actualBitString);
    if (bitDecStringValue > 1099511627775) {
      setDecValue("Too large!");
      setHexValue("Too large!");
    } else {
      setDecValue(formatDecimal(bitDecStringValue));
      setHexValue(getHexValueBasic(actualBitString));
    }
  }, [bitString, fill, fillWith]);

  /* ----------------- END use effects & management ----------------- */

  /* ----------------- START helper methods ----------------- */

  const dec2bin = (dec) => {
    return (dec >>> 0).toString(2);
  };

  const getHexValue = (input = getBitString(true), shouldFill) => {
    if (!shouldFill && input.length !== 8) {
      return "-";
    }
    return getSafeOutput(parseInt(input, 2).toString(16));
  };

  const getOctValue = (input = getBitString(true), shouldFill) => {
    if (!shouldFill && input.length !== 8) {
      return "-";
    }
    return getSafeOutput(parseInt(input, 2).toString(8));
  };

  const getDecValue = (input = getBitString(true), shouldFill) => {
    if (!shouldFill && input.length !== 8) {
      return "-";
    }
    return getSafeOutput(parseInt(input, 2).toString(10));
  };

  const getDecValueBasic = (input) => {
    return getSafeOutput(parseInt(input, 2).toString(10));
  };

  const getHexValueBasic = (input) => {
    return getSafeOutput(parseInt(input, 2).toString(16));
  };

  const getSafeOutput = (input) => {
    return getBitString(false) !== "" ? input : "-";
  };

  const formatDecimal = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getRealBitSize = (_bitString, comparisonString) => {
    return _bitString.substr(
      _bitString.length - comparisonString.length,
      _bitString.length
    );
  };

  const invert = (pos, amount) => {
    changeToNewStringAt(
      getRealBitSize(
        dec2bin(~parseInt(getBitString(false).substring(pos, pos + amount), 2)),
        getBitString(false).substring(pos, pos + amount)
      ),
      pos
    );
  };

  const byteInvert = (start, end) => {
    const amount = end - start;
    if (amount > 0) {
      invert(start, amount);
    }
  };

  const canByteMove = (byteNumber, direction) => {
    const unfinished = getBitString(false).length % 8;
    // const canMoveLeft = direction &&
    // (byteNumber === 0 || (byteNumber === 1 && !fill && unfinished > 0);
    // const canMoveRight = !direction &&
    // (getBitString(true).length / 8 === byteNumber + 1 ||
    //   (byteNumber === 0 && !fill && unfinished > 0));

    // return !(canMoveLeft || canMoveRight)

    if (
      direction &&
      (byteNumber === 0 || (byteNumber === 1 && !fill && unfinished > 0))
    ) {
      return false;
    } else if (
      !direction &&
      (getBitString(true).length / 8 === byteNumber + 1 ||
        (byteNumber === 0 && !fill && unfinished > 0))
    ) {
      return false;
    } else {
      return true;
    }
  };

  /* ----------------- END helper methods ----------------- */

  /* ----------------- START UI stuff ----------------- */

  const onFocusTextArea = useCallback(
    (event, id) => {
      setCursorPosition(id ?? parseInt(event.target.id.split("_")[1]));
    },
    [setCursorPosition]
  );

  const onSelection = useCallback(
    (selectionRes) => {
      // if (
      //   selectionRes &&
      //   selectionRes.items &&
      //   selectionRes.items.length &&
      //   selectionRes.items.length > 0
      // ) {
      //   const selectionDirectionObject = findOutSelectionDirection(
      //     selectionRes.items
      //   );

      //   if (selectionDirectionObject.direction) {
      //     moveCursor(selectionDirectionObject.last + 1);
      //   } else {
      //     moveCursor(selectionDirectionObject.first - 1);
      //   }
      // }

      setSelection(selectionRes.items);
    },
    [selection]
  );

  const focusTextArea = useCallback((e) => {
    if (
      e.relatedTarget ||
      e.target.classList.contains("text_spacer") ||
      refDragSelector.current.getSelection().length > 0 ||
      e.target.nodeName === "INPUT"
    ) {
      return;
    }
    moveCursorToEnd();
  }, []);

  const findOutSelectionDirection = (selectionItems) => {
    const first = parseInt(selectionItems[0].id.split("_")[1]);
    const last = parseInt(
      selectionItems[selectionItems.length - 1].id.split("_")[1]
    );
    let items = selectionItems.map((item) => parseInt(item.id.split("_")[1]));
    items.sort((a, b) => a - b);
    return {
      direction: first < last,
      first: items[0],
      last: items[items.length - 1],
    };
  };

  const bit_input_bin_checker = (e) => {
    const numRegex = new RegExp("^[01]*$");

    if (e.which >= 48 && e.which <= 90) {
      if (!numRegex.test(parseInt(e.key))) e.preventDefault();
      return;
    }
  };

  /* ----------------- END UI stuff ----------------- */

  /* ----------------- START render methods ----------------- */

  const renderFillerBits = () => {
    const fillAmount = 8 - (refBitString.current.length % 8);

    if (fillWith !== "" && fill) {
      let counter = refBitString.current.length * 2 - 1;
      const renderFillerBitsResult = [];

      if (fillAmount === 8) {
        return;
      }

      for (let i = 0; i < fillAmount; i++) {
        const bitElem = (
          <Bit id={`bitElement_${counter}`} key={counter} index={-1} type="2">
            {fillWith}
          </Bit>
        );
        counter++;
        renderFillerBitsResult.push(
          <div
            key={counter}
            className={classNames("cell", "bit_cell", "bit_cell_filler", {
              bit_cell_filler_first: i === 0,
            })}
          >
            {bitElem}
          </div>
        );
        counter++;
      }

      return renderFillerBitsResult;
    }

    if (fillAmount !== 8) {
      return <div className={`bit_cell filler_${fillAmount}`}></div>;
    }

    return "";
  };

  const renderBits = () => {
    let counter = 1,
      cellCounter = -1,
      bitCounter = refBitString.current.length - 1;

    const renderBitsResult = [];

    bitString.split("").forEach((bit) => {
      if (["0", "1"].includes(bit)) {
        const bitElement = (
          <Bit
            id={`bitElement_${counter}`}
            key={counter}
            index={bitCounter}
            type="1"
          >
            {bit}
          </Bit>
        );
        counter++;
        bitCounter--;

        renderBitsResult.push(bitElement);
      }
    });

    if (refDragSelector.current.addSelectables) {
      refDragSelector.current.addSelectables(
        document.getElementsByClassName("selectable_bits")
      );
    }

    return renderBitsResult;
  };

  const renderBitNumbers = () => {
    const fillAmount = 8 - (refBitString.current.length % 8);
    const renderBitNumbersResult = [];

    if (fillAmount !== 8) {
      renderBitNumbersResult.push(
        <div className={`bit_number_cell filler_${fillAmount}`} key="1"></div>
      );
    }

    let counter = refBitString.current.length;
    refBitString.current.split("").forEach((bit, ind) => {
      renderBitNumbersResult.push(
        <div className="cell bit_number_cell bit_number" key={ind + 2}>
          {counter}
        </div>
      );
      counter--;
    });

    return renderBitNumbersResult;
  };

  const renderByteRulers = () => {
    const renderByteRulersResult = [];
    let counter = Math.ceil(refBitString.current.length / 8);

    for (let i = 0; i < Math.ceil(refBitString.current.length / 8); i++) {
      renderByteRulersResult.push(
        <div className="cell byte_ruler byte_ruler_cell" key={i}>
          <span className="byte_label">Byte {counter}</span>
        </div>
      );
      counter--;
    }

    return renderByteRulersResult;
  };
  const renderByteValues = () => {
    const renderByteValuesResult = [];
    let counter = Math.ceil(refBitString.current.length / 8);

    for (let i = 0; i < Math.ceil(refBitString.current.length / 8); i++) {
      let byteNumber = Math.ceil(getBitString(true).length / 8) - counter;

      renderByteValuesResult.push(
        <div className="cell byte_values byte_values_cell" key={i}>
          <span className="byte_label">
            <div>
              <b>Hex: </b>
              <span className="hex_val">
                {getHexValue(getByte(byteNumber, fill), fill)}
              </span>
            </div>
            <div>
              <b>Dec: </b>
              {getDecValue(getByte(byteNumber, fill), fill)}
            </div>
            <div>
              <b>Oct: </b>
              {getOctValue(getByte(byteNumber, fill), fill)}
            </div>
          </span>
        </div>
      );
      counter--;
    }

    return renderByteValuesResult;
  };
  const renderByteButtons = () => {
    const renderByteButtonsResult = [];
    let counter = Math.ceil(refBitString.current.length / 8);

    for (let i = 0; i < Math.ceil(refBitString.current.length / 8); i++) {
      let byteNumber = Math.ceil(getBitString(true).length / 8) - counter;

      renderByteButtonsResult.push(
        <div className="cell byte_buttons byte_buttons_cell" key={i}>
          <span className="byte_label">
            {" "}
            <button
              onClick={(e) => moveByte(byteNumber, true, e)}
              disabled={!canByteMove(byteNumber, true)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={() =>
                deleteFromListAt(
                  getByteStartPosition(byteNumber),
                  getByteEndPosition(byteNumber)
                )
              }
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
            <button onClick={() => copyByteToClipboad(byteNumber)}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button
              onClick={() =>
                byteInvert(
                  getByteStartPosition(byteNumber),
                  getByteEndPosition(byteNumber)
                )
              }
            >
              <FontAwesomeIcon icon={faRepeat} />
            </button>
            <button
              onClick={(e) => moveByte(byteNumber, false, e)}
              disabled={!canByteMove(byteNumber, false)}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </span>
        </div>
      );
      counter--;
    }

    return renderByteButtonsResult;
  };

  /* ----------------- END render methods ----------------- */

  return (
    <>
      <div className="bitlist" id={`bitlist_area_${areaId}`}>
        <div className="button_area">
          {bitString !== "" && (
            <>
              <div className="input_wrapper">
                <div className="label">Dec:</div>
                <input
                  type="input"
                  name="dec_input"
                  value={decValue}
                  readOnly
                ></input>
              </div>
              <div className="input_wrapper">
                <div className="label">Hex:</div>
                <input
                  type="input"
                  name="hex_input"
                  value={hexValue}
                  className="hex_input"
                  disabled
                  readOnly
                ></input>
              </div>
              <button onClick={deleteAllFromList}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
              <button onClick={copyAllFromListToClipboard}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button onClick={() => invert(0, bitString.length)}>
                <FontAwesomeIcon icon={faRepeat} />
              </button>
              <div className={`fillerBox box ${fill ? "" : "grey"}`}>
                <FontAwesomeIcon icon={faArrowsLeftRightToLine} />

                <input
                  name="fill"
                  type="checkbox"
                  checked={fill}
                  onChange={handleFillChange}
                />
                <Dropdown
                  options={["0", "1"]}
                  value={fillWith}
                  onChange={handleFillWithChange}
                  disabled={!fill}
                  className="dropdown"
                  controlClassName="dropdown_control"
                  menuClassName="dropdown_menu"
                  placeholderClassName="dropdown_placeholder"
                ></Dropdown>
              </div>
              <div className={`fillerBox box`}>
                <FontAwesomeIcon icon={faICursor} />
                <input
                  name="sticky"
                  type="checkbox"
                  checked={stickyCursor}
                  onChange={handleStickyCursorChange}
                />
              </div>
            </>
          )}
        </div>
        <div id={`bitlist_box_area_${areaId}`} className="bitbox">
          {renderFillerBits()}
          <div
            className="bit_section"
            style={{
              gridColumnEnd: `span ${getBitSectionFillAmount()}`,
            }}
          >
            {renderBits()}
            <input
              type="text"
              className="bit_input_field"
              onChange={handleBitInputChange}
              onKeyDown={bit_input_bin_checker}
              value={bitString}
            ></input>
          </div>
          {renderBitNumbers()}
          {renderByteRulers()}
          {renderByteValues()}
          {renderByteButtons()}
        </div>
      </div>
    </>
  );
};

export default BitList;
