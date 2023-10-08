import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class GoogleService {
    private readonly logger = new Logger(GoogleService.name);
    constructor(
    ) {
    }

}
