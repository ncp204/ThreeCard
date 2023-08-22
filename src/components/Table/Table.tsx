import { useGameContext } from "../../contexts/AppContext";
import Player from "../Player";
import './Table.scss'

export default function Table() {
    const gameContext = useGameContext();
    const contextData = {
        ...gameContext
    }

    const { players, frontCard, remaining, shuffleCards, drawCards, revealResult, resetGame } = contextData;

    return (
        <div className="wrapper">
            <div className="table">
                {
                    players?.map((player, index) => {
                        return (
                            <Player
                                key={player.id}
                                index={index + 1}
                                frontCard={frontCard || false}
                                name={player.name}
                                coins={player.coins}
                                point={player.point}
                                cards={player.cards}
                                lose={player.lose}
                            />
                        )
                    })
                }

                <div className="center-container">
                    <div className="container">
                        <div className="btn-row-1">
                            <div className="button btn-deck-cards">Deck Cards: {remaining}</div>
                        </div>
                        <div className="btn-row-2">
                            <button className="button btn-shuffle" onClick={shuffleCards}>Shuffle</button>
                            <button className="button btn-draw" onClick={drawCards}>Draw</button>
                            <button className="button btn-reveal" onClick={revealResult}>Reveal</button>
                        </div>
                        <div className="btn-row-3">
                            <button className="button btn-reset" onClick={resetGame}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
