import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function CropModal({ imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: undefined });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const handleDone = async () => {
    if (!completedCrop || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    let outputFormat = "image/png";
    if (imageSrc.includes(".jpg") || imageSrc.includes(".jpeg")) {
      outputFormat = "image/jpeg";
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      onCropComplete(blob);
    }, outputFormat);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = {
      unit: "px",
      x: 0,
      y: 0,
      width: width,
      height: height,
    };
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="text-sm text-gray-500 mb-2">
          <strong>Recommended logo aspect ratio:</strong> ~5:1 (e.g., 500×100
          pixels)
        </div>

        <ReactCrop
          src={imageSrc}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          keepSelection={true}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="To crop"
            className="max-h-96"
            style={{ maxWidth: "100%" }}
            onLoad={onImageLoad}
          />
        </ReactCrop>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleDone} className="btn-primary">
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropModal;
