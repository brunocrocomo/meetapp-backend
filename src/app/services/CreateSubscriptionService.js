import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class CreateSubscriptionService {
    async run({ meetupId, userId }) {
        const user = await User.findByPk(userId);
        const meetup = await Meetup.findByPk(meetupId, {
            include: [User],
        });

        if (meetup.past) {
            throw new Error(
                'You cannot subscribe to a meetup in a date in the past.'
            );
        }

        if (meetup.user_id === userId) {
            throw new Error('You cannot subscribe to your own meetup.');
        }

        const checkAlreadySubscribed = await Subscription.findOne({
            where: {
                user_id: user.id,
                meetup_id: meetup.id,
            },
        });

        if (checkAlreadySubscribed) {
            throw new Error('You are already subscribed to this meetup.');
        }

        const checkDate = await Subscription.findOne({
            where: {
                user_id: user.id,
            },
            include: [
                {
                    model: Meetup,
                    required: true,
                    where: {
                        date: meetup.date,
                    },
                },
            ],
        });

        if (checkDate) {
            throw new Error(
                'You cannot subscribe to two meetups that will occur at the same time.'
            );
        }

        const subscription = await Subscription.create({
            user_id: user.id,
            meetup_id: meetup.id,
        });

        await Queue.add(SubscriptionMail.key, {
            meetup,
            user,
        });

        return subscription;
    }
}

export default new CreateSubscriptionService();
