import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { hot } from "react-hot-loader";
import BitList from "./components/BitList.jsx";
import Dropdown from "react-dropdown";
import { useState, useCallback } from "react";

const App = () => {
  const [lists, setLists] = useState([
    <BitList initialBitString="" fillWith="0" />,
  ]);
  const addNewBitList = useCallback(() => {}, []);

  return (
    <>
      {lists.map((list) => (
        <>{list}</>
      ))}
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
