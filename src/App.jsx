import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";

import Home from "./pages/home";
import FinanceManager from "./pages/financemanager";
import Tags from "./pages/tags";
import Items from "./pages/items";
import Budgets from "./pages/budgets";
import BudgetDetails from "./pages/budgetdetails";
import Control from "./pages/control";

import Footer from "./components/footer";

function App() {
  const [budgets, setBudgets] = useState(() => {
    const storedBudgets = localStorage.getItem("budgets");
    return storedBudgets ? JSON.parse(storedBudgets) : [];
  });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestor-finanzas" element={<FinanceManager />} />
        <Route path="/etiquetas" element={<Tags />} />
        <Route path="/items" element={<Items />} />
        <Route path="/presupuestos" element={<Budgets budgets={budgets} setBudgets={setBudgets} />} />
        <Route path="/presupuesto/:id" element={<BudgetDetails budgets={budgets} setBudgets={setBudgets} />} />
        <Route path="/control" element={ <Control /> }></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
