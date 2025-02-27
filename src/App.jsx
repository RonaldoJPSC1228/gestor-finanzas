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
import Recomendaciones from "./pages/recomendaciones";

import Footer from "./components/footer";

function App() {
  const [budgets, setBudgets] = useState(() => {
    const storedBudgets = localStorage.getItem("budgets");
    return storedBudgets ? JSON.parse(storedBudgets) : [];
  });

  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestion" element={<FinanceManager />} />
        <Route path="/etiquetas" element={<Tags />} />
        <Route path="/items" element={<Items items={items} setItems={setItems}/>} />
        <Route path="/presupuestos" element={<Budgets budgets={budgets} setBudgets={setBudgets} />} />
        <Route path="/presupuesto/:id" element={<BudgetDetails budgets={budgets} setBudgets={setBudgets} />} />
        <Route path="/control" element={ <Control /> }></Route>
        <Route path="/recomendaciones" element={ <Recomendaciones items={items} /> }></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
