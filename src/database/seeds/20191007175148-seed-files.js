const today = new Date();
const files = [
    {
        id: 1,
        name: 'meetup_1.jpg',
        path: 'meetup_1.jpg',
        created_at: today,
        updated_at: today,
    },
    {
        id: 2,
        name: 'meetup_2.jpg',
        path: 'meetup_2.jpg',
        created_at: today,
        updated_at: today,
    },
    {
        id: 3,
        name: 'meetup_3.jpg',
        path: 'meetup_3.jpg',
        created_at: today,
        updated_at: today,
    },
    {
        id: 4,
        name: 'meetup_4.jpg',
        path: 'meetup_4.jpg',
        created_at: today,
        updated_at: today,
    },
    {
        id: 5,
        name: 'meetup_5.jpg',
        path: 'meetup_5.jpg',
        created_at: today,
        updated_at: today,
    },
];

module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert('files', files, {});
        await queryInterface.sequelize.query(
            `ALTER SEQUENCE "files_id_seq" RESTART WITH ${files.length + 1}`
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('files', null, {});
    },
};
