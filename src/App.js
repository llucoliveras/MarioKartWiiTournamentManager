import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { History, Lobbies, Players } from "./pages";
import { MainNavbar } from "./components";
import "./i18n";
import "./App.css";

const App = () => {
    return (
        <BrowserRouter basename="/MarioKartWiiTournamentManager">
			<div className="app-root">
				<MainNavbar style={{ padding: "1rem" }}>
					<Link to="/lobbies">Lobbies</Link> |{" "}
					<Link to="/players">Players</Link>
					<Link to="/history">History</Link>
				</MainNavbar>

				<div className="main-content">
					<Routes>
						<Route path="/lobbies" element={<Lobbies />} />
						<Route path="/players" element={<Players />} />
						<Route path="/history" element={<History />} />
					</Routes>
				</div>
			</div>
        </BrowserRouter>
    );
};


export default App;
