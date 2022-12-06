import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { hot } from "react-hot-loader";
import BitList from "./components/BitList.jsx";
import Dropdown from "react-dropdown";
import { useState, useCallback } from "react";

const App = () => {
  const [lists, setLists] = useState([
    <BitList inputBitString="101" fillWith="0" key="0" />,
  ]);

  const addNewBitList = useCallback(() => {
    setLists([
      ...lists,
      <BitList
        inputBitString=""
        fillWith="0"
        key={lists.length}
        deleteBitListCallback={() => deletBitList(lists.length)}
        isDeletable={true}
      />,
    ]);
  }, [lists, setLists]);

  const deletBitList = (index) => {
    setLists((oldLists) => {
      oldLists.splice(index, 1);
      return [...oldLists];
    });
  };

  return (
    <>
      {lists}
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
