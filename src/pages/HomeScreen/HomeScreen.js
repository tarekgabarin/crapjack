import React from 'react';

function HomeScreen(props) {


    function goToRound(event) {
        event.preventDefault();
        props.history.push('/round');
    }

    function goToInfoPage(event) {
        event.preventDefault();
        props.history.push('/info');
    }


    return (
        <section className={'mh7-l mh7-m mh3'}>

            <div className="flex flex-column">

                <div className={'mb0'}>
                    <h1 className={"f-headline mb0 lh-solid black"}>
                        Black
                    </h1>
                        <h1 className={"mt0 mb3 f-headline lh-solid dark-red"}>
                            Jack
                        </h1>
                </div>


                <div className={'mb2'}>
                    <a onClick={goToRound} className="f4 dim link ba dib pa2 black">
                        Play Round
                    </a>
                </div>

                <div>
                    <a onClick={goToInfoPage} className="f4 dim link ba dib pa2 dark-red">
                        About Game
                    </a>
                </div>


            </div>

        </section>
    );
}

export default HomeScreen;
