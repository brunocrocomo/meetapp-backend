import Meetup from '../models/Meetup';
import File from '../models/File';

import Cache from '../../lib/Cache';

class OrganizingController {
    async index(req, res) {
        const cacheKey = `user:${req.userId}:organizing`;
        const cached = await Cache.get(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const meetups = await Meetup.findAll({
            where: { user_id: req.userId },
            include: [
                { model: File, as: 'file', attributes: ['id', 'path', 'url'] },
            ],
            order: ['date'],
        });

        await Cache.set(cacheKey, meetups);

        return res.json(meetups);
    }
}

export default new OrganizingController();
