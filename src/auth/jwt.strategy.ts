import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: "dkfkdfdfkdjfkdfdjfjdlfjkkfdfd",
        })
    }

    async validate(payload: any) {
        return { userId: payload.id, phone: payload.phone, role: payload.role}
    }
}