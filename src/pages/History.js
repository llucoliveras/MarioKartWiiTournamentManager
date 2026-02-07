import { useState } from "react";
import "./History.css";
import { useTranslation } from "react-i18next";

const History = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);

    return (
        <div className="history-page">
            {history.length === 0 ? (
                <div className="history-empty">{t("history.empty")}</div>
                ) : (
                <div className="history-list">
                    {history.map((game) => (
                        <div key={game.id} className="history-card">
                            <div className="history-card-header">
                            <h2 className="history-game-title">{game.gameTitle}</h2>
                            <span className="history-lobby">{t("history.lobby", { lobbyId: game.id })}</span>
                            </div>

                            <ul className="history-players">
                                {game.players
                                    .sort((a, b) => b.scoreEarned - a.scoreEarned)
                                    .map((player, index) => (
                                        <li key={player.id} className="history-player-row">
                                            <span className="player-rank">#{index + 1}</span>
                                            <span className="player-name">{player.name}</span>
                                            <span className="player-score">+{player.scoreEarned} pts</span>
                                        </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default History;