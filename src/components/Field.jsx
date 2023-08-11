import React from 'react';

const Field = ({ label, ...props }) => {
    const { meta, getRef, ...rest} = props;
    return (
        <>
            <label>
                {label}
                <input {...rest} ref={(()=> getRef && getRef())()}/>
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};


export default Field;