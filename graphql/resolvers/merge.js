const DataLoader = require("dataloader");
const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    // events.sort((a,b) =>{
    //   return eventsIds.indexOf(a._id.toString())
    // })
    return events.map(transformEvent);
  } catch (error) {
    // all events with _id in array
    throw error;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

// merge user and events
const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
