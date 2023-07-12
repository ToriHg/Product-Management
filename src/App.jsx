import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProductPage from "./components/Table";
import LoginPage from "./components/Login";
import SearchAppBar from "./components/Bar";
import { useEffect, useState, useMemo } from "react";

function App() {
  const auth = localStorage.getItem("react-project-token");
  const [searchKeyWord, setSearchKeyWord] = useState("");

  return (
    <Router>
      <div className="App">
        <SearchAppBar keyWord={searchKeyWord} onSearch={setSearchKeyWord} />
        <Routes>
          <Route
            path="/"
            element={
              auth ? (
                <ProductPage keyWord={searchKeyWord} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={auth ? <Navigate to="/" /> : <LoginPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
