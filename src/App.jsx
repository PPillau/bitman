import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { hot } from "react-hot-loader";
import BitList from "./components/BitList.jsx";
import Dropdown from "react-dropdown";
import { useState, useCallback, createRef, useRef, useEffect } from "react";

const App = () => {
  const [lists, setLists] = useState([0]);
  const [refs, setRefs] = useState([]);

  useEffect(() => {
    setRefs((oldRefs) =>
      Array(lists.length)
        .fill()
        .map((_, i) => oldRefs[i] || createRef())
    );
  }, [lists.length]);

  const addNewBitList = useCallback(() => {
    setLists([...lists, 0]);
  }, [lists, setLists]);

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
          return <BitList fillWith="0" key={i} ref={refs[i]} />;
        } else {
          return (
            <BitList
              fillWith="0"
              key={i}
              deleteBitListCallback={() => deleteBitList(i)}
              isDeletable={true}
              ref={refs[i]}
              // inputBitString={refs[0].current.getBitStringRef()}
            />
          );
        }
      })}
      <div className="add_operation_container">
        <Dropdown
          value="Addition"
          className="operations_dropdown"
          controlClassName="operations_dropdown_control"
          menuClassName="operations_dropdown_menu"
          placeholderClassName="operations_dropdown_placeholder"
          options={["Addition", "Subtraction", "Division", "Multiplication"]}
        ></Dropdown>
        <button className="add_operation" onClick={addNewBitList}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </>
  );
};

export default hot(module)(App);
