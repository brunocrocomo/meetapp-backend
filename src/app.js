import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import { isBoom } from 'boom';

import routes from './routes';
import sentryConfig from './config/sentry';

import Cache from './lib/Cache';

import './database';

class App {
    constructor() {
        this.server = express();

        Sentry.init(sentryConfig);

        this.middlewares();
        this.routes();
        this.exceptionHandler();
        this.misc();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(helmet());
        this.server.use(cors());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );

        if (process.env.NODE_ENV !== 'development') {
            this.server.use(
                new RateLimit({
                    store: new RateLimitRedis({
                        client: redis.createClient({
                            host: process.env.REDIS_HOST,
                            port: process.env.REDIS_POST,
                        }),
                    }),
                    windowsMs: 1000 * 60 * 15,
                    max: 100,
                })
            );
        }
    }

    routes() {
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (isBoom(err)) {
                const { statusCode, message } = err.output.payload;
                return res.status(statusCode).json({ error: message });
            }

            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();

                return res.status(500).json(errors);
            }

            return res.status(500).json({ error: 'Internal server error.' });
        });
    }

    async misc() {
        // Invalidate 'user' cache for development purposes
        if (process.env.NODE_ENV === 'development') {
            await Cache.invalidatePrefix(`user:*`);
        }
    }
}

export default new App().server;
