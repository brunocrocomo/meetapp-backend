import { isBefore, parseISO } from 'date-fns';

import { badRequest } from 'boom';
import Cache from '../../lib/Cache';

import Meetup from '../models/Meetup';

class CreateMeetupService {
    async run({ userId, meetupInfo }) {
        if (isBefore(parseISO(meetupInfo.date), new Date())) {
            throw badRequest(
                'You cannot register a meetup in a date in the past.'
            );
        }

        const meetup = await Meetup.create({
            user_id: userId,
            ...meetupInfo,
        });

        /**
         * Invalidate cache
         */
        await Cache.invalidatePrefix(`user:${userId}:organizing`);

        return meetup;
    }
}

export default new CreateMeetupService();
