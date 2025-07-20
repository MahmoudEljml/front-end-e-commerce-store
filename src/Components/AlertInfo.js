import { Alert } from "@mui/material";
import { render } from 'react-dom';

export default function (text) {
    const alert = (
        <Alert sx={{ position: "fixed", bottom: 0, left: 0, zIndex: 999 }} severity="error"
            onClose={(e) => {
                document.body.removeChild(alertNode);
            }}>{text}
        </Alert>
    );
    const alertNode = document.createElement('div');
    render(alert, alertNode);
    document.body.appendChild(alertNode);
    setTimeout(() => {
        document.body.removeChild(alertNode);
    }, 3000);
}