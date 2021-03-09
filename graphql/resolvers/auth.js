const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (a) => {
    try {
      const { email, password } = a.userInput;
      const existingUser = await User.findOne({ email });
      // mongodb returns null (not throwing error) if not found
      if (existingUser) {
        throw new Error("user already exists");
      }
      const user = new User({
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const res = await user.save();
      return { ...res._doc, password: null };
    } catch (err) {
      throw new Error(`user not created: ${err}`);
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid credentials! ");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      `${process.env.SECRET_KEY}`,
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
