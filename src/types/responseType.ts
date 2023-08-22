import { Card } from "contexts/AppContext";

export interface ResponeType {
    success: boolean,
    deck_id: string,
    shuffled: boolean,
    remaining: number,
    cards: Card[],
    piples: {}
}