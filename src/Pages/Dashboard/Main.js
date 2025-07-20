import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { getCategoriesPaginate } from '../../Api/Api';

export default function Main() {


    React.useEffect(() => {
     
        // getCategoriesPaginate(2, 5).then(result => console.log(result));
    }, []);

    return (
        <PieChart
            series={[
                {
                    data: [
                        { id: 0, value: 10, label: 'series A' },
                        { id: 1, value: 20, label: 'series B' },
                        { id: 2, value: 40, label: 'series C' },
                    ],
                },
            ]}
            width={400}
            height={200}
        />
    );
}