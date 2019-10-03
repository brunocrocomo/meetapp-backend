import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            title: Yup.string(),
            description: Yup.string(),
            location: Yup.string(),
            date: Yup.date(),
            file_id: Yup.number(),
        });

        await schema.validate(req.body, { abortEarly: false });

        return next();
    } catch (err) {
        return res.status(400).json({
            error:
                'Incomplete request or invalid data. Please, check your data and try again.',
            messages: err.inner,
        });
    }
};
