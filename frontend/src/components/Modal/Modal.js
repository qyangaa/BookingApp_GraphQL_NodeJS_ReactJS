import React from "react";
import Backdrop from "../Backdrop/Backdrop";
import "./Modal.css";

export default function Modal(props) {
  return (
    <React.Fragment>
      <Backdrop />
      <div className="modal">
        <header className="modal__header">{props.title}</header>
        <section className="modal__content">{props.children}</section>
        <section className="modal__actions">
          {props.canCancel && (
            <button className="btn" onClick={props.onCancel}>
              Cancel
            </button>
          )}
          {props.canConfirm && (
            <button className="btn" onClick={props.onConfirm}>
              {props.confirmText}
            </button>
          )}
        </section>
      </div>
    </React.Fragment>
  );
}
