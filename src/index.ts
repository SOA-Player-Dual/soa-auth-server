import('module-alias/register')
import * as moduleAlias from 'module-alias';
const sourcePath = __dirname;
moduleAlias.addAliases({
    '@server': sourcePath,
    '@config': `${sourcePath}/config`,
    '@domain': `${sourcePath}/domain`,
    '@controller': `${sourcePath}/controller`,
    '@middleware': `${sourcePath}/middleware`,
    '@model': `${sourcePath}/model`,
    '@helper': `${sourcePath}/helper`,
    '@interface': `${sourcePath}/interface`,
});

import { createServer } from '@config/express';
import { AddressInfo } from 'net';
import http from 'http';
import 'dotenv/config';

const host = process.env.HOST;
const port = process.env.PORT;

const startServer = async () => {
    const app = await createServer();
    const server = http.createServer(app).listen({ host, port }, () => {
        const addressInfo = server.address() as AddressInfo;
        console.log(
            `Server is hosted at http://${addressInfo.address}:${addressInfo.port}`,
        );
    });

    const signalTrap: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    signalTrap.forEach((type) => {
        process.once(type, async () => {
            console.log(`process.once ${type}`);
            server.close(() => {
                console.log('Server closed!');
            });
        });
    });
};

startServer();
