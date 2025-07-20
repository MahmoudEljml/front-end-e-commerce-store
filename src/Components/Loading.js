import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';

export function Loading1() {

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            ></Backdrop>
            <CircularProgress className='position-fixed top-50 start-50' color="inherit" />


            {/* <div className="d-flex justify-content-center position-fixed top-50 start-50">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> */}
        </>
    );
}
