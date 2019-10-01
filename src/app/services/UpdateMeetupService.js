import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

class UpdateMeetupService {
    async run({ userId, meetupId, meetupInfo }) {
        const meetup = await Meetup.findByPk(meetupId);

        if (meetup.user_id !== userId) {
            throw new Error('You cannot modify a meetup you do not own.');
        }

        if (isBefore(parseISO(meetupInfo.date), new Date())) {
            throw new Error(
                'You cannot register a meetup in a date in the past.'
            );
        }

        if (meetup.past) {
            throw new Error(
                'You cannot modify a meetup in a date in the past.'
            );
        }

        await meetup.update(meetupInfo);

        return meetup;
    }
}

export default new UpdateMeetupService();
