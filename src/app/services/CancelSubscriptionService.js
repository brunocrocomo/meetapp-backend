import { badRequest } from 'boom';

import Subscription from '../models/Subscription';

import Cache from '../../lib/Cache';

class CancelSubscriptionService {
    async run({ meetupId, userId }) {
        const subscription = await Subscription.findOne({
            where: {
                user_id: userId,
                meetup_id: meetupId,
            },
        });

        if (!subscription) {
            throw badRequest(
                'It is not possible to unsubscribe from a meetup that you are not subscribed to.'
            );
        }

        await subscription.destroy();

        /**
         * Invalidate cache
         */
        await Cache.invalidatePrefix(`user:${userId}:subscriptions`);
    }
}

export default new CancelSubscriptionService();
