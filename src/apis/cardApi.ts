import { ResponeType } from "../types/responseType";
import http from "../utils/http";

export const shuffleCard = (deckCount: string | number) => {
    return http.get<ResponeType>(`new/shuffle/?deck_count=${deckCount || 1}`)
}

export const drawACard = (deckId: string, count: number) => {
    return http.get<ResponeType>(`${deckId}/draw/?count=${count || 3}`)
}