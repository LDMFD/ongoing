import React from 'react';

import './BreadcrumbBar.css';

const BreadcrumbBar = (props: any) => (
    <>
        <div className='ong-breadcrumb-bar'>
            {props.children}
        </div>
    </>
);

export default BreadcrumbBar;
