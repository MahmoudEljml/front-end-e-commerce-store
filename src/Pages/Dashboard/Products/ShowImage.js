import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function (props) {
    const { mode, image, key, deleteImage } = props;

    var url = "";
    var checkSize = "";
    if (mode == "oldImage") {
        url = image.image;
        checkSize = "";
    } else {
        url = URL.createObjectURL(image);
        checkSize = <div>{checkImageSize(image)}</div>;
    }

    return (
        <>
            <div key={key} className="mb-2 w-100">
                <div className="d-flex align-items-start justify-content-start flex-column gap-2 border p-2 px-4 position-relative">
                    <div className="d-flex align-items-center gap-2 ">
                        <img className="mb-3" src={url} width={100} ></img>
                        {checkSize}
                    </div>
                    <FontAwesomeIcon id="side-bar-icon-close"
                        icon={faXmark} style={{
                            cursor: "pointer",
                            width: "50px",
                            position: "absolute",
                            top: "15px",
                            right: "0"
                        }}
                        onClick={() => deleteImage(key, image)}
                    />
                    {props.children}
                </div>
            </div>
        </>
    )
}

function checkImageSize(image) {
    if ((image.size / 1024) < 1000) {
        return (image.size / 1024).toFixed(2) + " KB";
    } else {
        return (image.size / (1024 * 1024)).toFixed(2) + " MB";
    }
}
