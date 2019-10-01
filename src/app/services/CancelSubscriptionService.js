import Subscription from '../models/Subscription';

class CancelSubscriptionService {
    async run({ meetupId, userId }) {
        const subscription = await Subscription.findOne({
            where: {
                user_id: userId,
                meetup_id: meetupId,
            },
        });

        if (!subscription) {
            throw new Error(
                'It is not possible to unsubscribe from a meetup that you are not subscribed to.'
            );
        }

        await subscription.destroy();
    }
}

export default new CancelSubscriptionService();
