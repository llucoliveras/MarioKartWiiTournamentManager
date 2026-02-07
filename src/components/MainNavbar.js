import { useNavigate } from "react-router-dom";
import "./MainNavbar.css";
import { useEffect, useState } from "react";
import SettingsModal from "./SettingsModal";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const MainNavbar = ({ active }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState(localStorage.settings ? JSON.parse(localStorage.settings) : {});
	const items = [
		{ id: "lobbies", label: t("mainNavbar.lobbies") },
		{ id: "players", label: t("mainNavbar.players") },
		{ id: "history", label: t("mainNavbar.history") },
		{ id: "settings", label: t("mainNavbar.settings") },
	];

	const handleSaveSettings = () => {
		localStorage.settings = JSON.stringify(settings);
		i18next.changeLanguage(settings.language || "en");
	}

	return (
		<>
			<nav className="navbar">
				{items.map(item => (
					<button
						key={item.id}
						className={active === item.id ? "active" : ""}
						onClick={() => {
							if (item.id !== "settings") navigate(item.id === "home" ? "/" : `/${item.id}`);
							else setShowSettings(true);
						}}
					>
						{item.label}
					</button>
				))}
			</nav>
			{ showSettings &&
				<SettingsModal
					handleSaveSettings={handleSaveSettings}
					setShowModal={setShowSettings}
					settings={settings}
					setSettings={setSettings}
				/>
			}
		</>
	);
}

export default MainNavbar;