import { HashRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
