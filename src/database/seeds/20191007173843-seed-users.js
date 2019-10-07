const faker = require('faker');

const today = new Date();
const users = [];
for (let id = 1; id <= 20; id += 1) {
    users.push({
        id,
        name: faker.name.findName(),
        email: faker.internet.email(),
        password_hash:
            '$2a$08$9LCtNkxdjNr6GxR2xCL4/u8.wO.Zxvh.tp945f/1tNC/ZgnIF6oB.',
        created_at: today,
        updated_at: today,
    });
}

module.exports = {
    up: async queryInterface => {
        await queryInterface.bulkInsert('users', users, {});
        await queryInterface.sequelize.query(
            `ALTER SEQUENCE "users_id_seq" RESTART WITH ${users.length + 1}`
        );
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
