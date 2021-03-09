import React, { useState, useRef, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import "./Events.css";

export default function Events() {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const titleElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();
  const descriptionElRef = useRef();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    return () => {
      setIsActive(false);
    };
  }, []);

  const fetchEvents = async () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await response.json();
      if (isActive) {
        setEvents(resData.data.events);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (isActive) {
        setIsLoading(false);
      }
    }
  };

  const modalConfirmHandler = async () => {
    modalCancelHandler();
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value; // add"+" to change to number
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
                mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
                    createEvent(eventInput: {
                        title: $title,
                        description: $description,
                        price: $price,
                        date: $date,
                      }){
                        _id
                        title
                        description
                        price
                        date
                      }
                }
            `,
      variables: {
        title: title,
        description: description,
        price: price,
        date: date,
      },
    };

    const token = authContext.token;

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await response.json();
      setEvents((prev) => {
        const updatedEvents = [...prev];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: authContext.userId,
          },
        });
        setIsLoading(false);
        return updatedEvents;
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const showDetailHandler = (eventId) => {
    setSelectedEvent((prev) => {
      const selectedEvent = events.find((e) => e._id === eventId);
      return selectedEvent;
    });
  };

  const bookEventHandler = async () => {
    if (!authContext.token) {
      setSelectedEvent(null);
    }
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!){
            bookEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
      variables: {
        id: selectedEvent._id,
      },
    };

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authContext.token,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await response.json();
      console.log({ resData });
      setSelectedEvent(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="Description">Description</label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionElRef}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}

      {authContext.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={authContext.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
}
