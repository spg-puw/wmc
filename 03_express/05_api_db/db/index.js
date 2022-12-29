require("colors")
const { Sequelize, Model, DataTypes } = require('sequelize');
const hash = require('../lib/helpers').hash;
const dbConfig = require('./config.json');

let sequelize = null;
let db = null;

exports.connect = () => {
    if (db) {
        return db;
    }

    if (sequelize === null) {
        sequelize = new Sequelize({
            ...dbConfig[process.env.NODE_ENV ?? 'development'],
            logging: process.env.NODE_ENV === "production" ? false : console.log
        }
        );
    }

    class NewsArticle extends Model { }
    NewsArticle.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        headline: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageurl: {
            type: DataTypes.STRING(250),
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'newsarticle',
        paranoid: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });

    class Users extends Model { }
    Users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            set(value) {
                // storing passwords in plaintext in the database is terrible - hash it!
                this.setDataValue('password', hash(value));
            }
        },
        isAdmin: DataTypes.BOOLEAN,
        avatarUrl: DataTypes.STRING(512),
        numComments: {
            type: DataTypes.VIRTUAL,
            async get() {
                const comments = await this.getComments();
                return comments.length ?? 0;
            },
            set(value) {
                throw new Error('Do not try to set `numPosts` property!');
            },
        }
    }, { sequelize, modelName: 'users', paranoid: true, });

    class Comments extends Model { }
    Comments.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        commentText: DataTypes.TEXT,
        commentTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, { sequelize, modelName: 'comments', paranoid: true, /* allowNull: false, */ });

    // associations
    Users.hasMany(Comments);
    Comments.belongsTo(Users); //FK: userId
    NewsArticle.hasMany(Comments, { foreignKey: 'articleId' });
    Comments.belongsTo(NewsArticle, { foreignKey: 'articleId' });
    Users.hasMany(NewsArticle, { foreignKey: 'author_userId' });
    NewsArticle.belongsTo(Users, { foreignKey: 'author_userId' });

    sequelize
        .sync({
            // force: true, // for dev/test only - recreated db!
            alter: true,
        })
        .then(async () => {
            // seed data
            if ((await Users.findAndCountAll({})).count > 0) { //quick and dirty
                return;
            }
            console.log(`seeding data`.yellow);

            await Users.create({
                username: 'user1',
                password: 'user1',
                isAdmin: true,
                avatarUrl: null
            }).then((r) => {
                console.log(`table ${r.constructor.name}: inserted id ${r.id}`.yellow);
            });

            await Users.create({
                username: 'user2',
                password: 'user2',
                isAdmin: false,
                avatarUrl: null
            }).then((r) => {
                console.log(`table ${r.constructor.name}: inserted id ${r.id}`.yellow);
            });

            await Users.create({
                username: 'user3',
                password: 'user3',
                isAdmin: false,
                avatarUrl: null
            }).then((r) => {
                console.log(`table ${r.constructor.name}: inserted id ${r.id}`.yellow);
            });

            await NewsArticle.bulkCreate([
                { author_userId: 1, headline: 'HTL Spengergasse ist toll', content: 'hier steht was', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2022/11/AnimationNeu-400x290.jpg' },
                { author_userId: 2, headline: 'AR Technologie wird besser', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/shutterstock_1456783511-400x290.jpg' },
                { author_userId: 1, headline: 'Alien VR Headsets für Studierende', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/shutterstock_1036798225-400x290.jpg' },
                { author_userId: 2, headline: 'Kooperation ist wichtig', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/04/shutterstock_718743133-Kopie-400x290.jpg' },
                { author_userId: 1, headline: 'Ärztemangel wird durch KI behoben', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/Biomedizin2-3-400x290.jpg' },
                { author_userId: 2, headline: 'Miniwindräder lösen Energieprobleme', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/shutterstock_1105744331_lo-400x290.jpg' },
                { author_userId: 1, headline: 'Holzbau schont die Umwelt', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/Kolleg_Interior_002-400x290.jpg' },
                { author_userId: 3, headline: 'Roboter übernehmen die Weltherrschaft', content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', imageurl: 'https://www.spengergasse.at/wp-content/uploads/2020/02/shutterstock_536524603-400x290.jpg' },
                { author_userId: 3, headline: 'Wo ist das O in Spengergasse?', content: 'was sonst?', imageurl: null },
                { headline: 'Diese API ist toll!', content: 'ja :)', imageurl: null },
            ]).then((res) => {
                for (const r of res) {
                    console.log(`table ${r.constructor.name}: inserted id ${r.id}`.yellow);
                }
            });

            await Comments.bulkCreate([
                { userId: 1, articleId: 1, commentText: 'ja, stimme zu', commentTime: DataTypes.DATE.NOW },
                { userId: 2, articleId: 1, commentText: 'ich auch', commentTime: DataTypes.DATE.NOW },
                { userId: 2, articleId: 8, commentText: 'nicht Roboter, es sind die Aliens', commentTime: DataTypes.DATE.NOW },
                { userId: 3, articleId: 8, commentText: 'JA! sie sind unter uns!', commentTime: DataTypes.DATE.NOW },
                { userId: 3, articleId: 8, commentText: 'ich sehe sie', commentTime: DataTypes.DATE.NOW },
            ]).then((res) => {
                for (const r of res) {
                    console.log(`table ${r.constructor.name}: inserted id ${r.id}`.yellow);
                }
            });
        })
        // .authenticate()
        .then(() => {
            console.log('Connection to database established successfully');
        })
        .catch(err => {
            console.log('Unable to connect to the database: ', err);
        });

    db = {
        model: {
            NewsArticle: NewsArticle,
            Users: Users,
            Comments: Comments,
        },
        db: sequelize,
        Sequelize: Sequelize,
    };

    return db;
};