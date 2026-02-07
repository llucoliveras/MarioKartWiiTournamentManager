import { useEffect, useState } from "react";
import "./Lobbies.css";
import Lobby from "../components/Lobby";
import LobbyModal from "../components/LobbyModal";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Lobbies = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [modalLobby, setModalLobby] = useState({ id: null, title: "", players: [] });
    const [modalType, setModalType] = useState("start");
    const [modalAdditionalData, setModalAdditionalData] = useState([]);
    const [games, setGames] = useState(JSON.parse(localStorage.getItem("games")) || []);
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("players")) || []);
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);

    useEffect(() => {
        localStorage.setItem("games", JSON.stringify(games));
    }, [games, location.pathname]);

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
    }, [players, location.pathname]);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history, location.pathname]);

    const handleCreateLobby = (title) => {
        const newLobby = {
            id: games.length + 1,
            title: title,
            players: [],
        };
        setGames(prevGames => [...prevGames, newLobby]);
    };

    const handleDeleteLobby = (gameId) => {
        setGames(prevGames => prevGames.filter(g => g.id !== gameId));
    };

    const handleCreateGame = (players) => {
        setGames(prevGames => prevGames.map(g => g.id === modalLobby.id ? { ...g, players: players } : g));
    };

    const handleCancelGame = (game) => {
        setGames(prevGames => prevGames.map(g => g.id === game.id ? { ...g, players: [] } : g));
    }

    const handleGenerateGame = (game) => {
        const ocupiedPlayerIds = games.flatMap(g => g.players.map(p => p.id));
        const availablePlayers = players.filter(p => !ocupiedPlayerIds.includes(p.id));
        const sortedPlayers = availablePlayers.sort((a, b) => {
            const aLastPlayed = history.slice().reverse().findIndex(h => h.players.some(p => p.id === a.id));
            const bLastPlayed = history.slice().reverse().findIndex(h => h.players.some(p => p.id === b.id));
            if (a.gamesPlayed === b.gamesPlayed) {
                return aLastPlayed - bLastPlayed;
            }
            return a.gamesPlayed - b.gamesPlayed;
        }
        );
        const selectedPlayers = sortedPlayers.slice(0, 4);
        setGames(prevGames => prevGames.map(g => g.id === game.id ? { ...g, players: selectedPlayers } : g));
    }

    const handleFinishGame = (game, playerScore) => {
        // Update player scores
        setPlayers(prevPlayers => prevPlayers.map(p => {
            const scoreEntry = playerScore.find(ps => ps.id === p.id);
            if (scoreEntry) {
                return { ...p, score: +p.score + +scoreEntry.scoreEarned, gamesPlayed: +p.gamesPlayed + 1 };
            }
            return p;
        }));

        // Clear players from the game
        setGames(prevGames => prevGames.map(g => {
            if (g.id === game.id) {
                return { ...g, players: [] };
            }
            return g;
        }));

        setHistory(prevHistory => [
            ...prevHistory,
            {
                id: prevHistory.length + 1,
                gameTitle: game.title,
                players: playerScore.map(ps => ({ id: ps.id, name: players.find(p => p.id === ps.id)?.name, scoreEarned: ps.scoreEarned }))
            }
        ]);
    };

    return (
        <div className="home-page">
            <div className="home-inner">
                <div className="games-row">
                    {games.map((game) => (
                        <Lobby
                            key={game.id}
                            game={game}
                            players={players}
                            setShowModal={setShowModal}
                            setModalType={setModalType}
                            setModalLobby={setModalLobby}
                            handleGenerateGame={handleGenerateGame}
                            setModalAdditionalData={setModalAdditionalData}
                        />
                    ))}
                </div>

                <button
                    className={`add-game-button ${games.length === 0 ? "empty" : ""}`}
                    onClick={() => {
                        setModalType("create");
                        setShowModal(true);
                    }}
                >
                    {t("lobby.addLobby")}
                </button>
            </div>

            {showModal && (
                <LobbyModal
                    modal={modalLobby}
                    players={players}
                    setModal={setModalLobby}
                    modalType={modalType}
                    modalAdditionalData={modalAdditionalData}
                    setShowModal={setShowModal}
                    handleCreateLobby={handleCreateLobby}
                    handleCreateGame={handleCreateGame}
                    handleCancelGame={handleCancelGame}
                    handleGenerateGame={handleGenerateGame}
                    handleFinishGame={handleFinishGame}
                    handleDeleteLobby={handleDeleteLobby}
                />
            )}
        </div>
    );
};


export default Lobbies;
