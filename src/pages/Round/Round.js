import React, {useState, useEffect} from 'react';
import Card from '../../components/Card/Card'
import {shuffleCards, drawCards} from "../../utils/api";

function Round() {

        const [state, setState] = useState({
            cardValuesMaps: {
                'ACE': [1, 11],
                '2': [2],
                '3': [3],
                '4': [4],
                '5': [5],
                '6': [6],
                '7': [7],
                '8': [8],
                '9': [9],
                '10': [10],
                'JACK': [10],
                'KING': [10],
                'QUEEN': [10]
            },
            houseCardImageUrl:'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg',
            gameInSession: true,
            playerWon: null,
            houseCards: [],
            playerCards: [],
            deckId: null
        });

        ///// Upon the page mounting, use the cards API to get the deck of cards, and draw cards for the player and house.
        useEffect(() => {

            /// API call to get the Deck ID
            shuffleCards(1)
                .then(response => response.json())
                .then(data => {

                    const deckId = data.deck_id;

                    /// API call to draw the cards
                    drawCards(deckId, 6)
                        .then(response1 => response1.json())
                        .then(cardsResponse => {

                            /// Equally distribute cards to House and the Player
                            const cards = cardsResponse.cards;
                            const halfOfCardsSize = Math.floor(cards.length / 2);
                            const playerCards = cards.slice(0, halfOfCardsSize);
                            const houseCards = cards.slice(halfOfCardsSize, cards.length);

                            setState({
                                ...state,
                                playerCards,
                                houseCards,
                                deckId
                            })

                        }).catch(err => {
                            if (err) {
                                throw err;
                            }
                        });


                })
                .catch(err => {
                if (err){
                    throw err;
                }
            })


        }, []);

        return (
            <section className={'mh7-ns mt1-ns mt4'}>

                <div className="flex flex-column">

                    <div className="flex w-100 w-100-ns pa1 pa2-ns justify-center">
                        <Card image={state.houseCardImageUrl} value={'1'} />
                        <Card image={state.houseCardImageUrl} value={'10'} />
                        <Card image={state.houseCardImageUrl} value={'A'} />
                    </div>


                    <div className="mb1">
                        <h1 className={'f1 tc'}>Game In Session</h1>
                    </div>

                    <div className="flex w-100 w-100-ns pa1 mb4-ns pa2-ns justify-center">
                        <Card image={"https://deckofcardsapi.com/static/img/KH.png"} value={'1'} />
                        <Card image={"https://deckofcardsapi.com/static/img/KH.png"} value={'10'} />
                        <Card image={"https://deckofcardsapi.com/static/img/KH.png"}  value={'A'} />
                    </div>


                    <div className={'mb2'}>
                         <button className={'input-reset pa1 h2 fw1 bg-black white ba w-100 b--black br2'}>Reveal</button>
                    </div>


                </div>

            </section>
        );

}

export default Round;
