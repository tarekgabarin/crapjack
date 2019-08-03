export function drawCards(deckId, numberOfCardsToDraw) {

    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numberOfCardsToDraw}`;

    return fetch(url)
}

export function shuffleCards(numberOfDecks) {

    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${numberOfDecks}`;

    return fetch(url)

}
