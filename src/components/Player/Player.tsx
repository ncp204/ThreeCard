import './Player.scss';
import { Player as PlayerType } from 'contexts/AppContext';

interface PlayerProps extends Omit<PlayerType, 'id'> {
    index: number,
    frontCard: boolean
}

// const backImage = 'https://deckofcardsapi.com/static/img/back.png';
const backImage = '/assets/images/back.png';

export default function Player({ index, name, coins, point, cards, frontCard, lose }: PlayerProps) {
    return (
        <>
            <div className={`player player${index}`}>
                <div className='container'>
                    {
                        lose &&
                        <div>
                            <span className='txt-lose'>NOT ENOUGH COINS</span>
                        </div>
                    }
                    <div className={`cards ${lose ? 'cards-lose' : ''}`}>
                        {
                            cards.map((card, index) => (
                                <img key={index} className='card' src={frontCard === true ? card.image : backImage} alt={`Card ${index + 1}`} />
                            ))
                        }
                        {/* {
                            lose &&
                            <div className='lose'>
                                <span>
                                    LOSE
                                </span>
                            </div>
                        } */}
                    </div>
                    <div className='player-infor'>
                        <span>Coins: {coins}</span>
                        <span><b>{name}</b></span>
                        <span>Point of 3 cards: {point}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
