import { useEffect, useState } from "react";
import "./Players.css";
import PlayerModal from "../components/PlayerModal";
import { useTranslation } from "react-i18next";

const Players = () => {
    const { t } = useTranslation();
    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem("players");
        return saved ? JSON.parse(saved) : [];
    });
    const [modalType, setModalType] = useState("add");

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
    }, [players]);

    const [showModal, setShowModal] = useState(false);
    const [modalPlayer, setModalPlayer] = useState({ name: "", score: 0, gamesPlayed: 0 });

    const handleAddPlayer = () => {
        if (!modalPlayer.name) return;

        if (modalPlayer.score < 0 || modalPlayer.score === "") modalPlayer.score = 0;
        if (modalPlayer.gamesPlayed < 0 || modalPlayer.gamesPlayed === "") modalPlayer.gamesPlayed = 0;

        const id = players.length ? Math.max(...players.map(p => p.id)) + 1 : 1;
        if (modalType === "edit") {
            setPlayers(players.map(p => p.id === modalPlayer.id ? modalPlayer : p));
        } else if (modalType === "add") {
            setPlayers([
                ...players,
                {
                    id,
                    name: modalPlayer.name,
                    score: Number(modalPlayer.score) || 0,
                    gamesPlayed: Number(modalPlayer.gamesPlayed) || 0,
                },
            ]);
        } else if (modalType === "delete") {
            setPlayers(players.filter(p => p.id !== modalPlayer.id));
        }
        setModalPlayer({ name: "", score: 0, gamesPlayed: 0 });
        setShowModal(false);
    };

    return (
        <div className="players-page">
            <div className="players-card">
                <table className="players-table">
                    <thead>
                        <tr>
                            <th>{t("generic.player")}</th>
                            <th>{t("players.points")}</th>
                            <th>{t("players.games")}</th>
                            <th>{t("players.modify")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...players]
                            .sort((a, b) => {
                                if (b.score !== a.score) return b.score - a.score;
                                if (a.gamesPlayed !== b.gamesPlayed) return a.gamesPlayed - b.gamesPlayed;
                                return a.name.localeCompare(b.name);
                            })
                            .map((player) => (
                                <tr key={player.id}>
                                    <td className="player-name">
                                        {player.name}
                                    </td>
                                    <td>{player.score}</td>
                                    <td>{player.gamesPlayed}</td>
                                    <td className="table-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() => {
                                                setModalPlayer(player);
                                                setModalType("edit");
                                                setShowModal(true);
                                            }}
                                        >&#9998;</button>
                                        <button
                                            className="delete-button"
                                            onClick={() => {
                                                setModalPlayer(player);
                                                setModalType("delete");
                                                setShowModal(true);
                                            }}
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {/* Add Player button inside card, at the bottom */}
                <div style={{ padding: "1rem", textAlign: "right" }}>
                <button
                    className="add-button"
                    onClick={() => {
                        setModalType("add")
                        setShowModal(true)
                    }}>
                    {t("players.addPlayer")}
                </button>
            </div>
        </div>

        {showModal && (
            <PlayerModal modalPlayer={modalPlayer} setModalPlayer={setModalPlayer} modalType={modalType} handleAddPlayer={handleAddPlayer} setShowModal={setShowModal} />
        )}
        </div>
    );
};

export default Players;
