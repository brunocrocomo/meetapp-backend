import { badRequest, unauthorized } from 'boom';

import Meetup from '../models/Meetup';

import Cache from '../../lib/Cache';

class CancelMeetupService {
    async run({ userId, meetupId }) {
        const meetup = await Meetup.findByPk(meetupId);

        if (!meetup) {
            throw badRequest('Meetup does not exists.');
        }

        if (meetup.user_id !== userId) {
            throw unauthorized('You cannot delete a meetup you do not own.');
        }

        if (meetup.past) {
            throw badRequest(
                'You cannot delete a meetup in a date in the past.'
            );
        }

        await meetup.destroy();

        /**
         * Invalidate cache
         */
        await Cache.invalidatePrefix(`user:${userId}:organizing`);
    }
}

export default new CancelMeetupService();
