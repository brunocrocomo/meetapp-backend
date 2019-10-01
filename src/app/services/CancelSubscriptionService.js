import Subscription from '../models/Subscription';

class CancelSubscriptionService {
    async run({ id }) {
        const subscription = await Subscription.findByPk(id);

        if (!subscription) {
            throw new Error(
                'It is not possible to unsubscribe from a meetup that you are not subscribed to.'
            );
        }

        await subscription.destroy();
    }
}

export default new CancelSubscriptionService();
