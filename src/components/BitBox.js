import React from "react";
import ReactTooltip from "react-tooltip";

const BitBox = React.forwardRef(
  ({ listLength, index, bit, color, children, cursorToLeft = false }, ref) => {
    const colorList = ["bg-blue-600", "bg-gray-600", "bg-green-600"];
    const [actualIndex, setActualIndex] = React.useState(index);
    listLength;

    // const BitBoxRef = React.useRef();

    const changeActualIndex = (newIndex) => {
      setActualIndex(newIndex);
    };

    const bitBoxRef = React.useRef();

    React.useImperativeHandle(
      ref,
      () => ({
        changeActualIndex: changeActualIndex,
      }),
      [bitBoxRef]
    );

    React.useEffect(() => {
      if (ref !== null) ref.current.changeActualIndex = changeActualIndex;
    }, [ref]);

    // useImperativeHandle(
    //   ref,
    //   () => {
    //     return {
    //       changeActualIndex: changeActualIndex,
    //     };
    //   },
    //   [BitBoxRef]
    // );

    // function rerender() {
    //   setActualIndex(listLength(true).length - index);
    // }

    React.useEffect(() => {
      // const observer = new MutationObserver(rerender);
      // observer.observe(document.getElementById('updater'), {
      //   characterData: false,
      //   attributes: false,
      //   childList: true,
      //   subtree: false,
      // });
    }, []);

    return (
      <div className="cell bit" ref={bitBoxRef}>
        {cursorToLeft && children}
        <span
          data-tip={"dummystring"}
          data-for={"bitbox-" + actualIndex}
          className={`${colorList[color]} flex inline-block cursor-pointer justify-center rounded-md items-center text-white font-extrabold text-center h-12 w-8 px-2 py-2`}
        >
          {bit}
          {!cursorToLeft && children}
        </span>
        <ReactTooltip
          id={"bitbox-" + actualIndex}
          effect="solid"
          getContent={() => {
            return (
              <span>
                2<sup>{actualIndex}</sup> = {Math.pow(2, actualIndex)}
              </span>
            );
          }}
        />
      </div>
    );
  }
);

export default BitBox;
