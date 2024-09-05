import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TransferToken from "./pages/TransferToken";
import CreateHbargotchi from "./pages/CreateHbargotchi";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/create" element={<CreateHbargotchi />} /> */}
      <Route path="/transfer" element={<TransferToken />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
}
