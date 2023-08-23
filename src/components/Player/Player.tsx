import './Player.scss';
import { Player as PlayerType } from 'contexts/AppContext';

interface PlayerProps {
    index: number,
    frontCard: boolean
    player: PlayerType
}

const backImage = '/assets/images/back.png';

export default function Player({ index, player, frontCard }: PlayerProps) {
    return (
        <>
            <div className={`player player${index}`}>
                <div className='container'>
                    {
                        player.lose &&
                        <div>
                            <span className='txt-lose'>NOT ENOUGH COINS</span>
                        </div>
                    }
                    <div className={`cards ${player.lose ? 'cards-lose' : ''}`}>
                        {
                            player.cards.map((card, index) => (
                                <img key={index} className='card' src={frontCard === true ? card.image : backImage} alt={`Card ${index + 1}`} />
                            ))
                        }
                    </div>
                    <div className='player-infor'>
                        <span>Coins: {player.coins}</span>
                        <span><b>{player.name}</b></span>
                        <span>Point of 3 cards: {player.point}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
