import DeleteSvg from "components/icons/DeleteSvg";
import { useTranslation } from "next-i18next";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
export default function DeleteModal({
  show,
  loading,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) {
  const { config: { darkMode }, } = useSelector((state) => state);
  const Dark = darkMode ? "bg-dark" : "";
  const { t } = useTranslation("main");

  return (
    <Modal show={show} size="md" onHide={onCancel} centered className="border-0">
      <Modal.Header
        closeButton
        className={`${Dark} text-secondary`}
      >
        <Modal.Title className="" as="h4">
          {t(title || "are_you_sure?")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={`${Dark}  border-0 d-flex justify-content-center
			align-items-center flex-column gap-3 `}
        style={{ minHeight: "200px" }}
      >
        <DeleteSvg darkMode={darkMode} />
        <p className="lead text-secondary">{t(description || "are_you_sure_you_want_to_delete_this_table")}</p>
      </Modal.Body>
      <Modal.Footer
        className={`d-flex justify-content-center ${Dark}`}
      >
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="danger"
          className={`px-4 py-2 ms-3 ${darkMode ? "text-white" : ""} `}
        >
          {t(confirmText || "yes,_delete_it!")}
        </Button>
        <Button
          variant="primary"
          className={`px-4 py-2 ms-3 ${darkMode ? "text-white" : ""}`}
          onClick={onCancel}
        >
          {/* <FontAwesomeIcon
                        className="mx-2"
                        icon={faTimes}
                        size="sm"
                    /> */}
          {t(cancelText || "no,_cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
