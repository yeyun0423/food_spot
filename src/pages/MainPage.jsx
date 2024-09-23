import { useState } from "react";
import Header from "../components/Header";
import Map from "../components/Map";

const MainPage = () => {
  const [inputData, setInputData] = useState("");
  const [location, setLocation] = useState("");
  const handleSearch = () => {
    setLocation(inputData);
  };

  return (
    <div className="container">
      <Header />
      <Map location={location} />
      <div className="search-container">
        <input
          type="text"
          placeholder="위치를 입력하세요"
          value={inputData}
          onChange={(e) => {
            setInputData(e.target.value);
          }}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
    </div>
  );
};

export default MainPage;
