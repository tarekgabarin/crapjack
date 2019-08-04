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

        function prepareGame(){

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
                                deckId,
                                gameInSession: true,
                                playerWon: null,
                                gameTied: false,
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

        }

        ///// Upon the page mounting, use the cards API to get the deck of cards, and draw cards for the player and house.
        useEffect(() => {

            prepareGame();

        }, []);

        /// Rerun the code to prepare a game when player begins a new round
        function onReplay(event) {
            event.preventDefault();
            prepareGame()
        }

        function onReveal() {


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

                    /// Player and House are tied.
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



        function onHit(event) {

            event.preventDefault();

            drawCards(state.deckId, 1)
                .then(response => response.json())
                .then(cardsResponse => {

                    let newPlayersCards = state.playerCards;

                    let newCard =  cardsResponse.cards[0];

                    newPlayersCards.unshift(newCard);

                    setState({
                        ...state,
                        playerCards: newPlayersCards
                    })

                })
                .then(() => {

                    const totalValueOfPlayersSoftHand = state.playerCards.map(item => {
                        return state.cardValuesMaps[item.value][0];
                    }).reduce((total, num) => {
                        return total + num
                    }, 0);

                    const totalValueOfPlayersHardHand = state.playerCards.map(item => {

                        if (item.value === "ACE"){
                            return state.cardValuesMaps[item.value][1];
                        } else {
                            return state.cardValuesMaps[item.value][0];
                        }
                    }).reduce((total, num) => {
                        return total + num
                    }, 0);

                    /// If the players cards are at or exceed 21, then the game is over and the cards are revealed.
                    if (totalValueOfPlayersSoftHand >= 21 && totalValueOfPlayersHardHand >= 21){
                        onReveal()
                    }

                })
                .catch(err => {
                    if (err) throw err;
                })
        }

        function onStand(event) {

            event.preventDefault();

            drawCards(state.deckId, 1)
                .then(response => response.json())
                .then(cardsResponse => {

                    let newHouseCards = state.houseCards;

                    let newCard =  cardsResponse.cards[0];

                    newHouseCards.unshift(newCard);

                    setState({
                        ...state,
                        houseCards: newHouseCards
                    })

                })
                .then(() => {

                    const totalValueOfHousesSoftHand = state.houseCards.map(item => {
                        return state.cardValuesMaps[item.value][0];
                    }).reduce((total, num) => {
                        return total + num
                    }, 0);

                    const totalValueOfHousesHardHand = state.houseCards.map(item => {
                        if (item.value === "ACE"){
                            return state.cardValuesMaps[item.value][1];
                        } else {
                            return state.cardValuesMaps[item.value][0];
                        }
                    }).reduce((total, num) => {
                        return total + num
                    }, 0);

                    /// If the Houses cards are at or exceed 17, then the game is over and the cards are revealed.
                    if (totalValueOfHousesSoftHand >= 17 && totalValueOfHousesHardHand >= 17){
                        onReveal()
                    }
                 }).catch(err => {

                     if (err) throw err;

                 })


        }

        const playersHandJSX = state.playerCards.map(item => {
            return (
                <Card image={item.image} value={item.value} />
            )
        });

        const housesHandHidden = state.houseCards.map((item, index) => {

            const imageOfCard = (index === state.houseCards.length - 1)  ? (state.houseCardImageUrl) : (item.image);

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

        const returnGameStatusJSX = () => {

            if (state.playerWon === null){
                return (<h1 className={'f1 tc'}>Game In Session</h1>)
            } else {

                const WinOrTieJSX = (state.gameTied) ? (<h1 className={'f1 gold tc'}>Game Tied</h1>) : (<h1 className={'f1 dark-green tc'}>You Win</h1>);

                return (state.playerWon) ? (WinOrTieJSX) : (<h1 className={'f1 dark-red tc'}>House Wins</h1>)
            }
        };


        const returnGameOptionsJSX = () => {

            if(state.gameInSession){
                return (
                    <div className="flex">
                        <div className="w-50">
                            <button onClick={onHit} className="input-reset w-100 pa1 white h2 bg-black b--black br2">Hit</button>
                        </div>
                        <div className="w-50">
                            <button onClick={onStand} className="input-reset w-100 pa1 h2 black bg-white b--black br2">Stand</button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <button onClick={onReplay} className={'input-reset pa1 h2 fw1 bg-black white ba w-100 b--black br2'}>Replay</button>
                )
            }
        };

        const gameStatusJSX = returnGameStatusJSX();

        const gameOptionsJSX = returnGameOptionsJSX();

        return (
            <section className={'mh7-ns mt1-ns mt4'}>

                <div className="flex flex-column">

                    <div className="flex w-100 w-100-ns pa1 pa2-ns justify-center">
                        {housesHand}
                    </div>


                    <div className="mb1">
                        {gameStatusJSX}
                    </div>

                    <div className="flex w-100 w-100-ns pa1 mb4-ns pa2-ns justify-center">
                        {playersHandJSX}
                    </div>


                    <div className={'mb2'}>
                        {gameOptionsJSX}
                    </div>


                </div>

            </section>
        );

}

export default Round;
