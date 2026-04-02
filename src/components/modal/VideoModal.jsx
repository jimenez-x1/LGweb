import React from "react";
import { Modal } from "react-bootstrap";
import { useEduorContext } from "../../context/EduorContext";

const VideoModal = () => {
  const { showVideo, handleVideoClose } = useEduorContext();
  const embedUrl =
    "https://www.youtube.com/embed/0M1C9yEzplI?si=Z3EwaFEt9ugA_2XS";

  return (
    <Modal
      show={showVideo}
      onHide={handleVideoClose}
      size="lg"
      centered
      className="modal-video"
      id="LKQIY6EGFR9TU"
    >
      <Modal.Header className="vidoe-modal-header" closeButton></Modal.Header>
      <Modal.Body className="modal-video-body">
        <div className="modal-video-inner" id="modal-video-inner-LKQIY6EGFR9TU">
          <div className="modal-video-movie-wrap">
            <iframe
              className="video-modal-iframe"
              src={embedUrl}
              allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;