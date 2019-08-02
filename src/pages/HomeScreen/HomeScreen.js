import React from 'react';

function HomeScreen(props) {

    return (
        <section className={'mh7-l mh7-m'}>

            <div className="flex flex-column">

                <header className="tc ph4">
                    <h1 className={'f1'}>
                        BlackJack
                    </h1>
                </header>


                <div>
                    <div className="flex justify-around">
                        <div>
                            <a className="f4 dim link ba dib pa2 dark-blue">
                                Play Round
                            </a>
                        </div>

                        <div>
                            <a className="f4 dim link ba dib pa2 dark-green">
                                About Game
                            </a>
                        </div>

                    </div>
                </div>

            </div>

        </section>
    );
}

export default HomeScreen;
