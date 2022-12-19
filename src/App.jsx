import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { hot } from "react-hot-loader";
import BitList, { OPERATIONS } from "./components/BitList.jsx";
import Dropdown from "react-dropdown";
import { useState, useCallback, createRef, useRef, useEffect } from "react";

const App = () => {
  const ref = useRef();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [lists, setLists] = useState([0]);
  const updateCallback = useCallback(() => {
    forceUpdate();
  }, [lists, setLists]);
  const firstElement = (
    <BitList
      fillWith="0"
      key={0}
      actualKey={0}
      ref={ref}
      updateCallback={updateCallback}
    />
  );
  const [operation, setOperation] = useState(0);
  // const [refs, setRefs] = useState([]);

  // const addToRefs = (el) => {
  //   console.log(el, "FFF");
  //   if (el && !refs.current.includes(el)) {
  //     refs.current.push(el);
  //   }
  // };

  const handleOperationChange = useCallback(
    (operation) => {
      setOperation(OPERATIONS[operation.value]);
    },
    [setOperation]
  );

  const addNewBitList = useCallback(() => {
    setLists([...lists, operation]);
  }, [lists, setLists, operation]);

  const deleteBitList = (index) => {
    setLists((oldLists) => {
      oldLists.splice(index, 1);
      return [...oldLists];
    });
  };

  return (
    <>
      {lists.map((list, i) => {
        if (i === 0) {
          return firstElement;
        } else {
          return (
            <BitList
              fillWith="0"
              key={i}
              actualKey={i}
              deleteBitListCallback={() => deleteBitList(i)}
              isDeletable={true}
              inputBitString={ref.current.getBitStringRef()}
              inputBitOperation={list}
            />
          );
        }
      })}
      <div className="add_operation_container">
        <Dropdown
          value={Object.keys(OPERATIONS)[0]}
          className="operations_dropdown"
          controlClassName="operations_dropdown_control"
          menuClassName="operations_dropdown_menu"
          placeholderClassName="operations_dropdown_placeholder"
          options={Object.keys(OPERATIONS)}
          onChange={handleOperationChange}
        ></Dropdown>
        <button className="add_operation" onClick={addNewBitList}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </>
  );
};

export default hot(module)(App);