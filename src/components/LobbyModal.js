import { useState } from "react";
import "./Lobby.css";
import { useTranslation } from "react-i18next";

const LobbyModal = ({ modal, players, setModal, modalType, modalAdditionalData, setShowModal, handleCreateLobby, handleDeleteLobby, handleCreateGame, handleCancelGame, handleFinishGame }) => {
    const { t } = useTranslation();
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [search, setSearch] = useState("");

    const closeModal = () => {
        setModal({ name: "", score: 0, gamesPlayed: 0 });
        setShowModal(false);
    }

    const togglePlayer = (player) => {
        setSelectedPlayers((prev) => {
            const alreadySelected = prev.some(p => p.id === player.id);

            if (alreadySelected) {
                // remove
                return prev.filter(p => p.id !== player.id);
            }

            if (prev.length >= 4) {
                // max reached → do nothing
                return prev;
            }

            // add
            return [...prev, player];
        });
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(search.toLowerCase())
    );

    return <div className="modal-backdrop">
        <div className="modal">
            { modalType == "create" ?
                <>
                    <h2>{t("lobby.addLobby")}</h2>
                    <input
                        type="text"
                        placeholder={t("lobby.title")}
                        value={modal.title || ""}
                        onChange={e => setModal({ ...modal, title: e.target.value })}
                    />
                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                handleCreateLobby(modal.title);
                                closeModal();
                            }}
                        >
                            {t("lobby.addLobby")}
                        </button>
                        <button onClick={() => closeModal()}>{t("generic.cancel")}</button>
                    </div>
                </>
            : modalType == "delete" ?
                <>
                    <h2><strong>{t("lobby.deleteLobby")}</strong></h2>
                    <p>{t("lobby.deleteLobbyMessage", { lobby: modal.title })}</p>
                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                handleDeleteLobby(modal.id);
                                closeModal();
                            }}
                        >
                            {t("lobby.deleteLobby")}
                        </button>
                        <button onClick={() => closeModal()}>{t("generic.cancel")}</button>
                    </div>
                </>
            : modalType == "start" ?
                <>
                    <h2>{t("lobby.createGame")}</h2>

                    <div className="player-picker">
                        <label>{t("lobby.selectPlayers")}</label>

                        {/* Selected chips */}
                        <div className="selected-chips">
                            {selectedPlayers.map(player => (
                                <span key={player.id} className="chip">
                                    {player.name}
                                    <button onClick={() => togglePlayer(player)}>×</button>
                                </span>
                            ))}
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder={t("lobby.searchPlayers")}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        {/* Results */}
                        <div className="player-results">
                            {filteredPlayers.map(player => {
                                const selected = selectedPlayers.some(p => p.id === player.id);
                                const disabled = !selected && selectedPlayers.length >= 4;

                                return (
                                    <div
                                        key={player.id}
                                        className={`player-row ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                                        onClick={() => !disabled && togglePlayer(player)}
                                    >
                                        {player.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                handleCreateGame(selectedPlayers);
                                closeModal();
                            }}
                        >
                            {t("lobby.startGame")}
                        </button>
                        <button onClick={() => closeModal()}>Cancel</button>
                    </div>
                </>
            : modalType == "cancel" ?
                <>
                    <h2>{t("lobby.cancelGame")}</h2>
                    <p>{t("lobby.cancelGameMessage", { game: modal.title })}</p>
                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                handleCancelGame(modal);
                                closeModal();
                            }}
                        >
                            {t("lobby.cancelGame")}
                        </button>
                        <button onClick={() => closeModal()}>{t("generic.close")}</button>
                    </div>
                </>
            : modalType == "finish" ?
                <>
                    {console.log(modalAdditionalData)}
                    <h2>{t("lobby.finishGame")}</h2>
                    <p>{t("lobby.finishGameMessage", { game: modal.title })}</p>
                    <div className="player-score-table">
                        {modal.players.map(player => {
                            return (
                                <div key={player.id} className="player-score-row">
                                    <label>{players.find(p => p.id === player.id).name}</label>
                                    <p>{modalAdditionalData.livePlayers.find(p => p.id === player.id)?.score || 0}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                const playerScore = modal.players.map(player => {
                                    const input = document.querySelector(`.player-score-row input[id="Score"][data-player-id="${player.id}"]`);
                                    return {
                                        id: player.id,
                                        scoreEarned: input ? input.value : 0,
                                    };
                                });
                                handleFinishGame(modal, playerScore);
                                closeModal();
                            }}
                        >
                            {t("lobby.finishGame")}
                        </button>
                        <button onClick={() => closeModal()}>{t("generic.close")}</button>
                    </div>
                </>
            : <></>
            }
        </div>
    </div>
}

export default LobbyModal;