import { drawACard, shuffleCard } from 'apis/cardApi';
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';

export type Card = {
    code: string,
    image: string,
    images: {
        svg: string,
        png: string,
    },
    value: string,
    suit: string
}


export type Player = {
    id: number,
    name: string,
    coins: number,
    point: number,
    cards: Card[],
    lose: boolean
}

export interface GameContextInterface {
    players: Player[];
    success: boolean,
    deckId: string;
    remaining: number;
    shuffled: boolean;
    frontCard: boolean;
    shuffleCards: () => void;
    drawCards: () => void;
    revealResult: () => void;
    resetGame: () => void;
}

export const GameContext = createContext<GameContextInterface | undefined>(undefined);

export function useGameContext() {
    return useContext(GameContext);
}

type GameContextValues = Omit<GameContextInterface, 'shuffleCards' | 'drawCards' | 'revealResult' | 'resetGame'>;


type stateType = GameContextValues & {
    frontCard: boolean;
}

const initialState: stateType = {
    players: [
        { id: 0, name: 'UserA', coins: 5000, point: 0, cards: [], lose: false },
        { id: 1, name: 'UserB', coins: 5000, point: 0, cards: [], lose: false },
        { id: 2, name: 'UserC', coins: 5000, point: 0, cards: [], lose: false },
        { id: 3, name: 'UserD', coins: 5000, point: 0, cards: [], lose: false },
    ],
    deckId: '',
    remaining: 0,
    shuffled: false,
    success: false,
    frontCard: false,
}

const LOSS_COINS = 900;

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<stateType>(initialState)

    const shuffleCards = async () => {
        try {
            if (state.shuffled && checkAvailabelCards(state.players, state.remaining)) {
                toast.info('There are still enough cards to play the game')
                return;
            }
            if (hasOnePlayer()) {
                toast.info('The game is finished, please click Reset button')
                return;
            }
            const res = await shuffleCard(1);
            setState((prevState) => ({
                ...prevState,
                success: res.data.success,
                shuffled: res.data.shuffled,
                deckId: res.data.deck_id,
                remaining: res.data.remaining
            }));
            toast.success('Shuffled')
        } catch (error) {

        }
    };

    const drawCards = async () => {
        try {
            if (hasOnePlayer()) {
                toast.warning('Insufficient number of players')
                return;
            }

            const { players, deckId, remaining } = state;

            if (checkAvailabelCards(players, remaining)) {
                if (!state.frontCard && state.players[0].cards.length === 3) {
                    toast.warning('Please click Reveal button')
                    return;
                }
                resetCardsAndPointPlayer(players)

                for (const i in players) {
                    let index = Number(i);
                    if (!players[index].lose) {
                        const res = await drawACard(deckId, 3);
                        const { cards, remaining, success } = res.data;
                        setState(prevState => {
                            const updatedPlayers = [...prevState.players];
                            updatedPlayers[index] = { ...updatedPlayers[index], cards };
                            return { ...prevState, players: updatedPlayers, remaining, success };
                        });
                    }
                }
            } else {
                toast.warning('Not enough cards, proceed to shuffle')
                setState(prev => ({ ...prev, shuffled: false }))
                await shuffleCards();
            }
        } catch (error) {

        }
    };

    const revealResult = () => {
        if (state.frontCard) {
            return;
        }
        const updatedPlayers = state.players.map((player) => ({
            ...player,
            point: calculatePlayerPoint(player.cards),
        }));

        const winnersId = findWinnersId(updatedPlayers);
        const winnerNameArr: string[] = []
        const finalPlayers = updatedPlayers.map((player) => {
            const coins = player.coins;
            const winner = winnersId.includes(player.id);
            if (winner) {
                winnerNameArr.push(player.name);
            }
            const finalCoins = winner ? coins : coins - LOSS_COINS;
            const notEnoughCoin = finalCoins < LOSS_COINS;
            return { ...player, coins: finalCoins, lose: notEnoughCoin };
        });

        setState((prev) => ({ ...prev, frontCard: true, players: finalPlayers }));
        const winnerName: string = winnerNameArr.length > 0 ? winnerNameArr.join(', ') : '';
        toast.success('Winner: ' + winnerName)
    };

    const resetGame = () => {
        setState(initialState);
        toast.success('Successfully reset the game')
    };

    const resetCardsAndPointPlayer = (players: Player[]) => {
        const updatedPlayers = players.map((player) => ({ ...player, cards: [], point: 0 }));
        setState((prev) => ({ ...prev, frontCard: false, players: updatedPlayers }));
        setTimeout(() => { }, 1000)

    }

    const calculatePlayerPoint = (cards: Card[]) => {
        const cardValues = cards.map(card => {
            const value = card.value;
            return value === "JACK" || value === "QUEEN" || value === "KING" ? 10
                : value === "ACE" ? 1
                    : parseInt(value);
        });

        const total = cardValues.reduce((sum, value) => sum + value, 0);
        return total < 10 ? total : total % 10;
    };

    //  Lấy mảng id các người chơi điểm cao nhất hoặc bằng nhau
    const findWinnersId = (players: Player[]): number[] => {
        if (players.length === 0) {
            return [];
        }

        const maxPoint = players.reduce((max, player) => {
            return player.point > max ? player.point : max;
        }, 0);

        const playersMaxPoint = players.filter(player => player.point === maxPoint);
        const ids = playersMaxPoint.map(players => players.id);

        return ids;
    };

    const hasOnePlayer = (): boolean => {
        const playerCopy = [...state.players];
        const result = playerCopy.filter(player => player.lose === false);

        if (result.length <= 1) {
            return true;
        }
        return false;
    }

    const checkAvailabelCards = (players: Player[], remaining: number): boolean => {
        const remainingPlayer = players.filter(player => player.coins >= LOSS_COINS).length;
        const result: boolean = remaining >= remainingPlayer * 3;
        return result;
    }

    const contextValue = {
        ...state,
        shuffleCards,
        drawCards,
        revealResult,
        resetGame,
    };

    return (
        <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
    );
}