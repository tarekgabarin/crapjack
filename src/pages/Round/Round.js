import React, {Component} from 'react';
import Card from '../../components/Card/Card'

function Round() {

        return (
            <section className={'mh7-l mh7-m'}>

                <div className="flex flex-column">

                    <div className="mb1">
                        <h1 className={'f1'}>House</h1>
                    </div>

                    <div className="flex pa2 outline justify-center">
                        <Card value={'1'} />
                        <Card value={'10'} />
                        <Card value={'A'} />
                    </div>


                    <div className="mb1">
                        <h1 className={'f1'}>Player</h1>
                    </div>

                    <div className="flex mb4 pa2 outline justify-center">
                        <Card value={'1'} />
                        <Card value={'10'} />
                        <Card value={'A'} />
                    </div>


                    <div className={'mb2'}>
                         <button className={'input-reset pa1 h2 fw1 bg-black white ba w-100 b--black br2'}>Reveal</button>
                    </div>


                </div>

            </section>
        );

}

export default Round;
