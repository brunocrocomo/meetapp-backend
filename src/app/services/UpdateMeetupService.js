import { isBefore, parseISO } from 'date-fns';
import { badRequest, unauthorized } from 'boom';

import Meetup from '../models/Meetup';

import Cache from '../../lib/Cache';

class UpdateMeetupService {
    async run({ userId, meetupId, meetupInfo }) {
        const meetup = await Meetup.findByPk(meetupId);

        if (!meetup) {
            throw badRequest('Meetup does not exists.');
        }

        if (meetup.user_id !== userId) {
            throw unauthorized('You cannot modify a meetup you do not own.');
        }

        if (isBefore(parseISO(meetupInfo.date), new Date())) {
            throw badRequest(
                'You cannot register a meetup in a date in the past.'
            );
        }

        if (meetup.past) {
            throw badRequest(
                'You cannot modify a meetup in a date in the past.'
            );
        }

        await meetup.update(meetupInfo);

        /**
         * Invalidate cache
         */
        await Cache.invalidatePrefix(`user:${userId}:organizing`);

        return meetup;
    }
}

export default new UpdateMeetupService();
