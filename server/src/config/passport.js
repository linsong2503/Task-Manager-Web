import passportJwt from "passport-jwt";
import config from "./config.js";
import { tokenTypes } from "./token.js";
import { UserModel } from "../models/index.js";

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      console.log("INVALID TOKEN TYPE");
      return done(null, false);
    }

    const user = await UserModel.findById(payload.sub);

    if (!user) {
      console.log("USER NOT FOUND");
      return done(null, false);
    }

    if (!user.active) {
      console.log("USER IS INACTIVE");
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);

    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
