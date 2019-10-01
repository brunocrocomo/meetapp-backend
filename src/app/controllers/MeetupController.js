import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import CreateMeetupService from '../services/CreateMeetupService';
import UpdateMeetupService from '../services/UpdateMeetupService';
import CancelMeetupService from '../services/CancelMeetupService';

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
        await CancelMeetupService.run({
            userId: req.userId,
            meetupId: req.params.id,
        });

        return res.send();
    }
}

export default new MeetupController();
