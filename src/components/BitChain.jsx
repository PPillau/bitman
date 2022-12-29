import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { hot } from "react-hot-loader";
import BitList, { OPERATIONS } from "./BitList.jsx";
import Dropdown from "react-dropdown";
import { useState, useCallback, createRef, useRef, useEffect } from "react";
import "./BitChain.css";

const BitChain = ({
  chainInputBitString = "",
  deleteBitChainCallback = undefined,
  chainInputOperation = OPERATIONS.AND,
}) => {
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
      inputBitString={chainInputBitString !== "" ? chainInputBitString : ""}
      isDeletable={chainInputBitString !== ""}
      isFullyDeletable={chainInputBitString !== ""}
      inputBitOperation={
        chainInputBitString !== "" ? chainInputOperation : OPERATIONS.AND
      }
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
    <div className="top_container">
      {chainInputBitString !== "" && (
        <button
          class="chain_delete_button"
          onClick={
            deleteBitChainCallback !== undefined ? deleteBitChainCallback : null
          }
        >
          X
        </button>
      )}
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
              inputBitString={
                chainInputBitString !== ""
                  ? chainInputBitString
                  : ref.current.getBitStringRef()
              }
              inputBitOperation={list}
            />
          );
        }
      })}
      {(!ref || !ref.current || ref.current.getBitStringRef().length > 0) && (
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
      )}
    </div>
  );
};

export default BitChain;
