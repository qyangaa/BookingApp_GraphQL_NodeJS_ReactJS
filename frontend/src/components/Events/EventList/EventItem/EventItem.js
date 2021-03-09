import React from "react";
import "./EventItem.css";

export default function EventItem(props) {
  return (
    <li key={props.eventid} className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You are the owner of this event</p>
        ) : (
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View Details
          </button>
        )}
      </div>
    </li>
  );
}
