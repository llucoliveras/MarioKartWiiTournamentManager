import { useState } from "react";
import "./Lobby.css";
import { useTranslation } from "react-i18next";

const Lobby = ({game, players, setShowModal, setModalType, setModalLobby, handleGenerateGame, setModalAdditionalData}) => {
    const { t } = useTranslation();
    const handleOpenModal = (type) => {
        setModalType(type);
        setModalLobby(game);
        setModalAdditionalData(type === "finish" ? { livePlayers: players.filter(player => game.players.some(gplayer => gplayer.id === player.id)) } : {});
        setShowModal(true);
    }
    const [livePlayers, setLivePlayers] = useState(players.filter(player => game.players.some(gplayer => gplayer.id === player.id)));

    const handleLivePlayers = (playerId, delta) => {
        let newScore = +livePlayers.find(p => p.id === playerId).score + +delta;
        if (newScore < 0) newScore = 0;
        setLivePlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: newScore } : p));
    };

    return (
        <div key={game.id} className="game-section">
            <div className="game-card">
                <h2>{game.title}</h2>
                {livePlayers.length === 0 ? (
                    <>
                        <p>{t("lobby.noGame")}</p>
                        <div className="game-actions">
                            <button className="game-btn primary" onClick={() => {
                                setModalType("start");
                                setModalLobby(game);
                                setShowModal(true);
                            }}>{t("lobby.startGame")}</button>
                            <button className="game-btn secondary" onClick={() => {handleGenerateGame(game);}}>{t("lobby.generateGame")}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <ul className="game-players-list"> 
                            {players.filter(player => game.players.some(gplayer => gplayer.id === player.id))
                            .sort((a, b) => b.score - a.score)
                            .map((player, index) => (
                                <li key={index} className="game-player-row">
                                    <span className="game-player-name">{player.name} ({player.score})</span>
                                    <div className="live-score-controls">
                                        <button onClick={() => handleLivePlayers(player.id, -1)}>−</button>
                                        <span className="game-player-score">{livePlayers.find(p => p.id === player.id)?.score}</span>
                                        <button onClick={() => handleLivePlayers(player.id, +1)}>+</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="game-actions">
                            <button className="game-btn primary" onClick={() => {handleOpenModal("finish");}}>
                                {t("lobby.finishGame")}
                            </button>
                            <button className="game-btn secondary" onClick={() => {handleOpenModal("cancel");}}>
                                {t("lobby.cancelGame")}
                            </button>
                        </div>
                    </>
                )}

                <div className="game-delete">
                    <button
                        className="game-btn danger"
                        onClick={() => handleOpenModal("delete")}
                    >
                        {t("lobby.deleteLobby")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;