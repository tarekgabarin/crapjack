import React from 'react';
import BlackJackValuesImage from '../../assets/images/Blackjack_Values.png';


function InfoPage() {
    return (
        <section className={'mh7-l mh7-m mh3'}>

            <h1 className={'f-headline tc'}>How to play</h1>

            <p>Equally well known as Twenty-One. The rules are simple, the play is thrilling, and there is opportunity for high strategy. In fact, for the expert player who mathematically plays a perfect game and is able to count cards, the odds are sometimes in that player's favor to win.</p>

            <p>But even for the casual participant who plays a reasonably good game, the casino odds are less, making Blackjack one of the most attractive casino games for the player. While the popularity of Blackjack dates from World War I, its roots go back to the 1760s in France, where it is called Vingt-et-Un (French for 21). Today, Blackjack is the one card game that can be found in every American gambling casino. As a popular home game, it is played with slightly different rules. In the casino version, the house is the dealer (a "permanent bank"). In casino play, the dealer remains standing, and the players are seated. The dealer is in charge of running all aspects of the game, from shuffling and dealing the cards to handling all bets. In the home game, all of the players have the opportunity to be the dealer (a "changing bank").</p>

            <h1 className={'f3 lh-copy'}>OBJECT OF THE GAME</h1>

            <p>Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.</p>

            <h1 className={'f3 lh-copy'}>CARD VALUES/SCORING</h1>

            <p>It is up to each individual player if an ace is worth 1 or 11. Face cards are 10 and any other card is its pip value.</p>

            <div className="flex justify-center">
                <div>
                    <img className={'br2'} src={BlackJackValuesImage} alt=""/>
                </div>
            </div>

            <h1 className={'f3 lh-copy'}>THE DEAL</h1>

            <p>At the start, the dealer gives one card face up to each player in rotation clockwise, and then one card face up to themselves. Another round of cards is then dealt face up to each player, but the dealer takes the second card face down. Thus, each player except the dealer receives two cards face up, and the dealer receives one card face up and one card face down. </p>

            <h1 className={'f3 lh-copy'}>THE PLAY</h1>

            <p>The player to the left goes first and must decide whether to "stand" (not ask for another card) or "hit" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes "bust" (if it is over 21). In the latter case, the player loses.</p>

            <p>The combination of an ace with a card other than a ten-card is known as a "soft hand," because the player can count the ace as a 1 or 11, and either draw cards or not. For example with a "soft 17" (an ace and a 6), the total is 7 or 17. While a count of 17 is a good hand, the player may wish to draw for a higher total. If the draw creates a bust hand by counting the ace as an 11, the player simply counts the ace as a 1 and continues playing by standing or "hitting" (asking the dealer for additional cards, one at a time).</p>

            <h1 className={'f3 lh-copy'}>THE DEALER'S PLAY</h1>

            <p>When the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.</p>

            <p>If both the player and dealer go bust, the player loses.</p>

            <hr></hr>

            <p>[The text on this page was take from this <a href="https://bicyclecards.com/how-to-play/blackjack/">article</a>]</p>

        </section>
    );
}

export default InfoPage;
