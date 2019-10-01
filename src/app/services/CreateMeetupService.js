import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

import Cache from '../../lib/Cache';

class CreateMeetupService {
    async run({ userId, meetupInfo }) {
        if (isBefore(parseISO(meetupInfo.date), new Date())) {
            throw new Error(
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
