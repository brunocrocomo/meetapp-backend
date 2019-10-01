import { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import CreateSubscriptionService from '../services/CreateSubscriptionService';

class SubscriptionController {
    async index(req, res) {
        const subscriptions = await Subscription.findAll({
            where: {
                user_id: req.userId,
            },
            include: [
                {
                    model: Meetup,
                    where: {
                        date: {
                            [Op.gt]: new Date(),
                        },
                    },
                    include: [
                        User,
                        {
                            model: File,
                            as: 'file',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                    required: true,
                },
            ],
            order: [[Meetup, 'date']],
        });

        return res.json(subscriptions);
    }

    async store(req, res) {
        const subscription = await CreateSubscriptionService.run({
            userId: req.userId,
            meetupId: req.params.meetupId,
        });

        return res.json(subscription);
    }

    async delete(req, res) {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return res.status(400).json({
                error:
                    'It is not possible to unsubscribe from a meetup that you are not subscribed.',
            });
        }

        await subscription.destroy();

        return res.send();
    }
}

export default new SubscriptionController();
