import {AppException} from '../exceptions/app.exception';
// import * as jwt from 'jsonwebtoken';

export class AuthUtils {

    public static decodeJwtToken(token: string): Promise<{ user: object }> {

        return new Promise((resolve, reject) => {
/*
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) return reject(AppException.INVALID_TOKEN);

                return resolve(decodedToken);
            });*/

        });

    }
}
