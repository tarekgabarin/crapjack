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
            gameTied: false,
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
                    drawCards(deckId, 4)
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
            const totalHouseCardsHardHand = calculateTotalValueOfCards(state.houseCards, false);

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


                /// Helper function that determines whether to use the softhand or hardhand for a given player when deciding the winner
                const getOptimalValue = (softHand, hardHand) => {

                    let returnValue;

                    if ( (softHand <= 21) && (hardHand <= 21) ){

                        returnValue = [softHand, hardHand].reduce(function (prev, curr) {
                            return (Math.abs(curr - 22) < Math.abs(prev - 22) ? curr : prev);
                        });

                    } else if ( (softHand > 21) && (hardHand <= 21) ){
                        returnValue = hardHand
                    } else if ( (hardHand > 21) && (softHand <= 21) ) {
                        returnValue = softHand
                    } else if (softHand === hardHand){
                        returnValue = softHand
                    }

                    return returnValue
                };


                let playersOptimalValueOfCards = getOptimalValue(totalPlayersCardsSoftHand, totalPlayersCardsHardHand);
                let housesOptimalValueOfCards = getOptimalValue(totalHouseCardsSoftHand, totalHouseCardsHardHand);


                //In the small chance that both the player and house have the exact value of 21
                if (playersOptimalValueOfCards === housesOptimalValueOfCards) {

                    /// If its a tie then the player wins.
                    setState({
                        ...state,
                        playerWon: false,
                        gameTied: true,
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
                        return (Math.abs(curr.totalCardsValue - 22) < Math.abs(prev.totalCardsValue - 22) ? curr : prev);
                    });


                    /// If House is closer to 21, player loses
                    if (winnerOfRound.player === 'House'){

                        setState({
                            ...state,
                            playerWon: false,
                            gameInSession: false
                        });

                        /// If Player is closer to 21 than he wins
                    } else if (winnerOfRound.player === "Player") {

                        setState({
                            ...state,
                            playerWon: true,
                            gameInSession: false
                        });

                    }


                }



            }

        }

        const playersHandJSX = state.playerCards.map(item => {
            return (
                <Card image={item.image} value={item.value} />
            )
        });

        const housesHandHidden = state.houseCards.map((item, index) => {

            ///TODO change Index to 1 when implementing hit/stand functionality
            const imageOfCard = (index === 1)  ? (state.houseCardImageUrl) : (item.image);

            return (
                <Card image={imageOfCard} value={item.value} />
            )
        });

        const houseHandRevealed = state.houseCards.map(item => {
            return (
                <Card image={item.image} value={item.value} />
            )
        });

        const housesHand = (state.gameInSession) ? (housesHandHidden) : (houseHandRevealed);

        ///TODO use this for now, will make a seperate page to show results

        let resultsJSX;

        if (state.playerWon === null){
            resultsJSX = (<h1 className={'f1 tc'}>Game In Session</h1>)
        } else {

            const WinOrTieJSX = (state.gameTied) ? (<h1 className={'f1 tc'}>Game Tied</h1>) : (<h1 className={'f1 tc'}>You Win</h1>)

            resultsJSX = (state.playerWon) ? (WinOrTieJSX) : (<h1 className={'f1 tc'}>House Wins</h1>)
        }



        return (
            <section className={'mh7-ns mt1-ns mt4'}>

                <div className="flex flex-column">

                    <div className="flex w-100 w-100-ns pa1 pa2-ns justify-center">
                        {housesHand}
                    </div>


                    <div className="mb1">
                        {resultsJSX}
                    </div>

                    <div className="flex w-100 w-100-ns pa1 mb4-ns pa2-ns justify-center">
                        {playersHandJSX}
                    </div>


                    <div className={'mb2'}>
                         <button onClick={reveal} className={'input-reset pa1 h2 fw1 bg-black white ba w-100 b--black br2'}>Reveal</button>
                    </div>


                </div>

            </section>
        );

}

export default Round;
