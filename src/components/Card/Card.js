import React from 'react';

function Card({image, value}) {
    return (
        <div style={{backgroundImage: "url(" + image + ")"}} className={'ba contain bg-center h5 b--near-black mh4 br2 pa5 w-30 w-30-s mw5'} >

        </div>
    );
}

export default Card;
