import React from 'react';

function Card({image, value}) {
    return (
        <div style={{backgroundImage: "url(" + image + ")"}} className={'ba contain bg-center h5 b--near-black mh4-ns br2 pa1-ns w-30-ns w-30'} >

        </div>
    );
}

export default Card;
