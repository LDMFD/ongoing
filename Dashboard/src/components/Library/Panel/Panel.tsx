import React from 'react';

import './Panel.css';

const Panel = (props: any) => (
    <>
        <div className='ong-panel'>
            {props.children}
        </div>
    </>
);

export default Panel;
