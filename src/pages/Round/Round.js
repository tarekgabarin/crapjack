import React, {useState} from 'react';
import Card from '../../components/Card/Card'

function Round() {

        const [state, setState] = useState({
            cardValuesMaps: {
                'A': [1, 11],
                '2': [2],
                '3': [3],
                '4': [4],
                '5': [5],
                '6': [6],
                '7': [7],
                '8': [8],
                '9': [9],
                '10': [10],
                'J': [10],
                'K': [10],
                'Q': [10]
            },
            houseCardImageUrl:'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg'
        })

        return (
            <section className={'mh7-l mh7-m mh1-s'}>

                <div className="flex flex-column">

                    <div className="flex pa2-ns justify-center">
                        <Card image={state.houseCardImageUrl} value={'1'} />
                        <Card image={state.houseCardImageUrl} value={'10'} />
                        <Card image={state.houseCardImageUrl} value={'A'} />
                    </div>


                    <div className="mb1">
                        <h1 className={'f1 tc'}>Player</h1>
                    </div>

                    <div className="flex mb4 pa2-ns justify-center">
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
