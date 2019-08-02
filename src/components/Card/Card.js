import React from 'react';

function Card(props) {
    return (
        <div className={'ba b--near-black mh4 br2 pa5 w-30-s mw5'} >
                <h1 className={'f1 lh-copy'}>{props.value}</h1>
        </div>
    );
}

export default Card;
