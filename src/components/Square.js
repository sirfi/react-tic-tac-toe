import React from 'react';

function Square({value, onClick}) {
    return (
        <button className={"square " + (value?value.toLowerCase():"")} onClick={onClick}>
            {value}
        </button>
    );
}
export default Square;