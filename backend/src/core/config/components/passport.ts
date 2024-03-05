// import { PassportStatic } from 'passport';
// import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
// import UserModel from '../../../features/user/user.model';
// import { Request } from 'express';

// const cookieExtractor = (req: Request): string | null => {
//     let token: string | null = null;
//     if (req && req.cookies && req.cookies.jwt) {
//         // Assuming your JWT token is directly stored under req.cookies.jwt
//         token = req.cookies.jwt;
//     }
//     console.log(token);
//     return token;
// };


// export default (passport: PassportStatic) => {
//   passport.use(new JWTStrategy({
//     jwtFromRequest: cookieExtractor, // Correctly using the adjusted function
//     secretOrKey: `${process.env.JWT_SECRET}`,
//   },
//   async (payload, done) => {
//     try {
//       const user = await UserModel.findById(payload.id).exec(); // Adjusted for async/await pattern
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     } catch (err) {
//       return done(err, false);
//     }
//   }));
// };
