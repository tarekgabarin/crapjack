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

        function reveal(event) {

            event.preventDefault();

            const calculateTotalValueOfCards = (arrayOfCards, isSoftHand) => {

                /// @params arrayOfCards - the array of cards belonging to either the House or Player
                /// @params isSoftHand - A boolean value that determines whether ACE is calculated as a 1 or 11

                let totalValue = 0;

                for (let i = 0; i < arrayOfCards.length; i++){

                    const valueOfCard = arrayOfCards[i].value;

                    if (valueOfCard === 'ACE'){

                        if (isSoftHand){
                            totalValue += state.cardValuesMaps[valueOfCard][0]
                        } else {
                            totalValue += state.cardValuesMaps[valueOfCard][1]
                        }
                    } else {

                        totalValue += state.cardValuesMaps[valueOfCard][0]

                    }

                }

                return totalValue

            };

            const totalPlayersCardsSoftHand = calculateTotalValueOfCards(state.playerCards, true);
            const totalPlayersCardsHardHand = calculateTotalValueOfCards(state.playerCards, false);
            const totalHouseCardsSoftHand = calculateTotalValueOfCards(state.houseCards, true);
            const totalHouseCardsHardHand = calculateTotalValueOfCards(state.houseCards, true);

            const hasHouseGoneBust = (totalHouseCardsSoftHand > 21) && (totalHouseCardsHardHand > 21);
            const hasPlayerGoneBust = (totalPlayersCardsSoftHand > 21) && (totalPlayersCardsHardHand > 21);

            //As per the rules of BlackJack, if both the Player and House go bust, the player loses
            if (hasHouseGoneBust && hasPlayerGoneBust){

                setState({
                    ...state,
                    playerWon: false,
                    gameInSession: false
                });

                /// If only Player goes bust
            } else if (!hasHouseGoneBust && hasPlayerGoneBust) {

                setState({
                    ...state,
                    playerWon: false,
                    gameInSession: false
                });

                //If only House goes bust
            } else if (hasHouseGoneBust && !hasPlayerGoneBust){

                setState({
                    ...state,
                    playerWon: true,
                    gameInSession: false
                });

                /// If neither the Player or House goes bust
            }  else if (!hasPlayerGoneBust && !hasHouseGoneBust) {


                /// Determine whether to use the softhand or hardhand for each player when deciding the winner
                const playersOptimalValueOfCards = (totalPlayersCardsSoftHand > totalPlayersCardsHardHand) ? totalPlayersCardsSoftHand : totalPlayersCardsHardHand;
                const housesOptimalValueOfCards = (totalHouseCardsSoftHand > totalHouseCardsHardHand) ? totalHouseCardsSoftHand : totalHouseCardsHardHand;

                //In the small chance that both the player and house have the exact value of 21
                if (playersOptimalValueOfCards === housesOptimalValueOfCards) {

                    /// If its a tie then the player wins.
                    setState({
                        ...state,
                        playerWon: true,
                        gameInSession: false
                    });

                } else {

                    const scoreInfo = [
                        {
                            player: 'House',
                            totalCardsValue: housesOptimalValueOfCards
                        },
                        {
                            player: 'Player',
                            totalCardsValue: playersOptimalValueOfCards
                        }
                    ];

                    /// Calculate whose total value is closer to 21, and thereby wins
                    const winnerOfRound = scoreInfo.reduce(function (prev, curr) {
                        return (Math.abs(curr.totalCardsValue - 21) < Math.abs(prev.totalCardsValue - 21) ? curr.player : prev.player);
                    });

                    /// If House is closer to 21, player loses
                    if (winnerOfRound === 'House'){

                        setState({
                            ...state,
                            playerWon: false,
                            gameInSession: false
                        });

                        /// If Player is closer to 21 than he wins
                    } else if (winnerOfRound === "Player") {

                        setState({
                            ...state,
                            playerWon: true,
                            gameInSession: false
                        });
                        
                    }


                }



            }

        }


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
