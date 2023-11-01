import { useState } from "react";
import QrReader from "react-qr-reader";

interface IProps {
  onResult: (uri: string | null) => void;
  onError: (error: string) => void;
}

export default function QrScan({ onResult, onError }: IProps) {
  const [show, setShow] = useState(false);
  const [uri] = useState("");

  const onShowScanner = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setShow(true))
        .catch(() => {
          window.open(chrome.runtime.getURL("permission.html"));
        });
    }
  };

  return (
    <div className="container">
      {show ? (
        <>
          {/* {loading && <Loading css={{ position: 'absolute' }} />} */}
          <div className="qrVideoMask">
            <QrReader
              onScan={onResult}
              onError={onError}
              style={{ width: "300px", height: "300px" }}
            />
          </div>
        </>
      ) : (
        <div className="">
          <img
            src="/qr-icon.svg"
            width={200}
            height={200}
            alt="qr code icon"
            className="qrIcon"
          />
          <button color="gradient" onClick={onShowScanner}>
            Scan QR code
          </button>

          <div>
            <input type="text" value={uri} />
            <button color="gradient" onClick={() => onResult(uri)}>
              Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
