const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find(); //.populate() to populate data pointed using ref in mongoose
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    // check authentication
    if (!req.isAuth) throw new Error("Unauthenticated!");
    // Create with mongo schema
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      let result = await event.save();
      createdEvent = transformEvent(result);
      const curUser = await User.findById(req.userId);
      if (!curUser) throw new Error("User not found");
      await curUser.createdEvents.push(createdEvent);
      await curUser.save();
      return createdEvent;
    } catch (err) {
      throw new Error(`event not created ${err}`);
    }
  },
};
