const faker = require('faker');

const firstDay = new Date(2019, 0, 1);
const lastDay = new Date(2019, 11, 31);
const today = new Date();
const meetups = [];
for (let id = 1; id <= 100; id += 1) {
    meetups.push({
        id,
        title: faker.name.jobTitle(),
        description: faker.lorem.sentence(15),
        location: faker.address.city(),
        date: faker.date.between(firstDay, lastDay),
        file_id: faker.random.number({ min: 1, max: 5 }),
        user_id: faker.random.number({ min: 1, max: 20 }),
        created_at: today,
        updated_at: today,
    });
}

module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert('meetups', meetups, {});
        await queryInterface.sequelize.query(
            `ALTER SEQUENCE "meetups_id_seq" RESTART WITH ${meetups.length + 1}`
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('meetups', null, {});
    },
};
