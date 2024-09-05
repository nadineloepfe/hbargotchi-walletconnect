import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Manage from "./pages/Manage";
import TransferToken from "./pages/TransferToken";
import QueryToken from "./pages/QueryToken";
import CreateHbargotchi from "./pages/CreateHbargotchi";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateHbargotchi />} />
      <Route path="/manage" element={<Manage />} />
      <Route path="/query" element={<QueryToken />} />
      <Route path="/transfer" element={<TransferToken />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
}
