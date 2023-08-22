import { drawACard, shuffleCard } from 'apis/cardApi';
import { createContext, useContext, useState, ReactNode } from 'react';

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

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<stateType>(initialState)

    const shuffleCards = async () => {
        try {
            const res = await shuffleCard(1);
            setState((prevState) => ({
                ...prevState,
                success: res.data.success,
                shuffled: res.data.shuffled,
                deckId: res.data.deck_id,
                remaining: res.data.remaining
            }));
        } catch (error) {

        }
    };

    const drawCards = async () => {
        try {
            const { players, deckId } = state;
            const remainingPlayer = players.filter(player => !player.lose).length;

            if (state.remaining >= remainingPlayer * 3) {
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
            }
        } catch (error) {

        }
    };



    const revealResult = () => {
        const updatedPlayers = state.players.map((player) => ({
            ...player,
            point: calculatePlayerPoint(player.cards),
        }));

        const winnersId = findWinnersId(updatedPlayers);
        const finalPlayers = updatedPlayers.map((player) => {
            const coins = player.coins;
            const lose = coins <= 900;
            const winner = winnersId.includes(player.id);
            return { ...player, coins: lose ? 0 : winner ? coins : coins - 900, lose };
        });

        setState((prev) => ({ ...prev, frontCard: !state.frontCard, players: finalPlayers }));
    };

    const resetGame = () => {
        setState(initialState);
    };

    const resetCardsAndPointPlayer = (players: Player[]) => {
        const updatedPlayers = players.map((player) => ({ ...player, cards: [], point: 0 }));
        setState((prev) => ({ ...prev, frontCard: false, players: updatedPlayers }));
        setTimeout(() => { }, 1000)
        console.log('state player', state.players);

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