import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import View from "./pages/View";
import Feed from "./pages/Feed";
import Gift from "./pages/Gift";
import Adopt from "./pages/Adopt";
import Community from "./pages/Community";
import Faq from "./pages/FAQ";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adopt" element={<Adopt />} />
      <Route path="/view" element={<View />} />
      <Route path="/gift" element={<Gift />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/community" element={<Community />} />
      <Route path="/faq" element={<Faq />} />
    </Routes>
  );
}
