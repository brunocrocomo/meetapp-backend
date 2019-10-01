import { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import CreateSubscriptionService from '../services/CreateSubscriptionService';
import CancelSubscriptionService from '../services/CancelSubscriptionService';

import Cache from '../../lib/Cache';

class SubscriptionController {
    async index(req, res) {
        const cacheKey = `user:${req.userId}:subscriptions`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return res.json(cached);
        }

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

        await Cache.set(cacheKey, subscriptions);

        return res.json(subscriptions);
    }

    async store(req, res) {
        const subscription = await CreateSubscriptionService.run({
            meetupId: req.params.meetupId,
            userId: req.userId,
        });

        return res.json(subscription);
    }

    async delete(req, res) {
        await CancelSubscriptionService.run({
            meetupId: req.params.meetupId,
            userId: req.userId,
        });

        return res.send();
    }
}

export default new SubscriptionController();
