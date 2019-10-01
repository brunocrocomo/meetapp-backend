import { Op } from 'sequelize';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import CreateMeetupService from '../services/CreateMeetupService';
import UpdateMeetupService from '../services/UpdateMeetupService';

class MeetupController {
    async index(req, res) {
        const where = {};
        const page = req.query.page || 1;

        if (req.query.date) {
            const searchDate = parseISO(req.query.date);

            where.date = {
                [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
            };
        }

        const meetups = await Meetup.findAll({
            where,
            include: [
                User,
                { model: File, as: 'file', attributes: ['id', 'path', 'url'] },
            ],
            limit: 10,
            offset: 10 * page - 10,
        });

        return res.json(meetups);
    }

    async store(req, res) {
        const meetup = await CreateMeetupService.run({
            userId: req.userId,
            meetupInfo: req.body,
        });
        return res.json(meetup);
    }

    async update(req, res) {
        const meetup = await UpdateMeetupService.run({
            userId: req.userId,
            meetupId: req.params.id,
            meetupInfo: req.body,
        });
        return res.json(meetup);
    }

    async delete(req, res) {
        const user_id = req.userId;

        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            return res
                .status(401)
                .json({ error: 'You cannot delete a meetup you do not own.' });
        }

        if (meetup.past) {
            return res.status(400).json({
                error: 'You cannot delete a meetup in a date in the past.',
            });
        }

        await meetup.destroy();

        return res.send();
    }
}

export default new MeetupController();
