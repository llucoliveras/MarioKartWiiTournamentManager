import "./GenericModal.css";
import { useTranslation } from "react-i18next";

const PlayerModal = ({ modalPlayer, setModalPlayer, modalType, handleAddPlayer, setShowModal }) => {
    const { t } = useTranslation();
    const closeModal = () => {
        setModalPlayer({ name: "", score: 0, gamesPlayed: 0 });
        setShowModal(false);
    }

    return <div className="modal-backdrop">
        <div className="modal">
            { modalType == "delete" ?
                <>
                    <h2>{t("players.deletePlayer")}</h2>
                    <p>{t("players.confirmDelete", { player: modalPlayer.name })}</p>
                    <div className="modal-buttons">
                        <button
                            onClick={() => {
                                handleAddPlayer();
                                closeModal();
                            }}
                        >
                            {t("players.deletePlayer")}
                        </button>
                        <button onClick={() => closeModal()}>{t("generic.cancel")}</button>
                    </div>
                </>
            :
                <>
                    <h2>{modalType === "add" ? t("players.addPlayer") : t("players.editPlayer")}</h2>

                    <label className="modal-field">
                        {t("players.playerName")}
                        <input
                            type="text"
                            value={modalPlayer.name}
                            onChange={(e) => setModalPlayer({ ...modalPlayer, name: e.target.value })}
                        />
                    </label>

                    <label className="modal-field">
                        {t("players.points")}
                        <input
                            type="text"
                            value={modalPlayer.score}
                            onChange={(e) => setModalPlayer({ ...modalPlayer, score: e.target.value })}
                        />
                    </label>

                    <label className="modal-field">
                        {t("players.games")}
                        <input
                            type="text"
                            value={modalPlayer.gamesPlayed}
                            onChange={(e) => setModalPlayer({ ...modalPlayer, gamesPlayed: e.target.value })}
                        />
                    </label>

                    <div className="modal-buttons">
                        <button onClick={handleAddPlayer}>{modalType === "add" ? t("players.addPlayer") : t("players.editPlayer")}</button>
                        <button onClick={() => closeModal()}>{t("generic.cancel")}</button>
                    </div>
                </>
            }
        </div>
    </div>
}

export default PlayerModal;