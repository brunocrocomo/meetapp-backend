import { isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';

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

        return meetup;
    }
}

export default new CreateMeetupService();
