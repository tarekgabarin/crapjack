import React from 'react';

function HomeScreen(props) {
    
    return (
        <section className="hero is-success is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title is-1">
                        BlackJack
                    </h1>
                    <div className="columns">
                        <div className="column">
                            <button className="button is-info">Start Game</button>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <button className="button is-warning">
                                How To Play
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeScreen;
