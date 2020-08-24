import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@core/services';
import { PaystackBvnData } from '@api/users';

const PAYSTACK_API_BASE =  'https://api.paystack.co';

@Injectable()
export class PaystackService {

    constructor(
        private readonly config: ConfigService,
        private readonly http: HttpService) {
    }

    async resolveBvn(bvn: string): Promise<PaystackBvnData> {

        const url = PAYSTACK_API_BASE + `/bank/resolve_bvn/${bvn}`;

        const config = {
            headers: { Authorization: `Bearer ${this.config.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' }
        }

        const res = await  this.http.get(url, config).toPromise();
        return res.data.data;
    }

}
