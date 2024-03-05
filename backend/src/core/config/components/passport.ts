import { NativeError } from 'mongoose';
import { PassportStatic } from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { UserData } from '../../../features/auth/auth/auth.interface';
import user from '../../../features/user/user.model';

export default (passport: PassportStatic) => {
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY || 'jvns',
  },
  (payload, done) => {
    user.findById(payload.id, (err: NativeError, user: UserData) => {
      if (err) {
        return done({ error: err }, false);
      }

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    });
  }));
};