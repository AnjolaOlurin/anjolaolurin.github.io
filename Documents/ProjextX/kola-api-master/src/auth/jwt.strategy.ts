import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@core/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  /**
   *
   * TODO: Do further token validation, looking up the publicId in a list of revoked tokens,
   * enabling us to perform token revocation.
   */
  async validate(payload: any) {
    return { publicId: payload.sub, email: payload.email };
  }
}
