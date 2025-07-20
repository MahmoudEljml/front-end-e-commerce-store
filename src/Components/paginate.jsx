import React, { useState } from 'react';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginatedItems({ itemsPerPage, data }) {

    const [activePage, setActivePage] = useState(1);

    const pageCount = data.length / itemsPerPage;

    return (
        <div >
            {/* <ReactPaginate
                className='d-flex space-between w-100'
                breakLabel="..."
                nextLabel="next >"
                // onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}

                previousLabel="< previous"
                activeClassName='bg-dark'
                renderOnZeroPageCount={null}
            /> */}

            <Stack spacing={2}>
                <Pagination count={pageCount} color="primary" page={activePage}
                    onChange={(event, value) => setActivePage(value)} />
            </Stack>
            {activePage}

        </div>
    );
}
