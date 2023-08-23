import { useGameContext } from "../../contexts/AppContext";
import Player from "../Player";
import './Table.scss'

export default function Table() {
    const gameContext = useGameContext();
    const contextData = {
        ...gameContext
    }

    const { players, frontCard, remaining, isDrawCards, shuffleCards, drawCards, revealResult, resetGame } = contextData;

    return (
        <div className="wrapper">
            <div className="table">
                {
                    players?.map((playerInfor, index) => {
                        return (
                            <Player
                                key={playerInfor.id}
                                index={index + 1}
                                frontCard={frontCard || false}
                                player={playerInfor}
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
                            <button disabled={isDrawCards} className={`button btn-shuffle ${isDrawCards ? 'disabled' : ''}`} onClick={shuffleCards}>Shuffle</button>
                            <button disabled={isDrawCards} className={`button btn-draw ${isDrawCards ? 'disabled' : ''}`} onClick={drawCards}>Draw</button>
                            <button disabled={isDrawCards} className={`button btn-reveal ${isDrawCards ? 'disabled' : ''}`} onClick={revealResult}>Reveal</button>
                        </div>
                        <div className="btn-row-3">
                            <button disabled={isDrawCards} className={`button btn-reset ${isDrawCards ? 'disabled' : ''}`} onClick={resetGame}>Reset</button>
                        </div>
                        {
                            isDrawCards && <div className="txt-isDrawing"><span>Is drawing...</span></div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
