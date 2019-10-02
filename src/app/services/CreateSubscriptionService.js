import { badRequest } from 'boom';

import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

import Cache from '../../lib/Cache';

class CreateSubscriptionService {
    async run({ meetupId, userId }) {
        const user = await User.findByPk(userId);
        const meetup = await Meetup.findByPk(meetupId, {
            include: [User],
        });

        if (meetup.past) {
            throw badRequest(
                'You cannot subscribe to a meetup in a date in the past.'
            );
        }

        if (meetup.user_id === userId) {
            throw badRequest('You cannot subscribe to your own meetup.');
        }

        const checkAlreadySubscribed = await Subscription.findOne({
            where: {
                user_id: user.id,
                meetup_id: meetup.id,
            },
        });

        if (checkAlreadySubscribed) {
            throw badRequest('You are already subscribed to this meetup.');
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
            throw badRequest(
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

        /**
         * Invalidate cache
         */
        await Cache.invalidatePrefix(`user:${userId}:subscriptions`);

        return subscription;
    }
}

export default new CreateSubscriptionService();
