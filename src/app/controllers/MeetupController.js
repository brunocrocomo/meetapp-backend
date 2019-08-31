import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string().required(),
            location: Yup.string().required(),
            date: Yup.date().required(),
            file_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({
                error: 'You cannot register a meetup in a date in the past.',
            });
        }

        const user_id = req.userId;

        const meetup = await Meetup.create({
            ...req.body,
            user_id,
        });

        return res.json(meetup);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            description: Yup.string(),
            location: Yup.string(),
            date: Yup.date(),
            file_id: Yup.number(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const user_id = req.userId;

        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== user_id) {
            return res
                .status(401)
                .json({ error: 'You cannot modify a meetup you do not own.' });
        }

        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({
                error: 'You cannot register a meetup in a date in the past.',
            });
        }

        if (meetup.past) {
            return res.status(400).json({
                error: 'You cannot modify a meetup in a date in the past.',
            });
        }

        await meetup.update(req.body);

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
