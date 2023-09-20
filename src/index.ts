import { agenda } from './worker';
import { initStorage } from './storage';
import { connectDatabase } from './database';

// connect to mongo db
connectDatabase((error) => {
  if (error) {
    console.log('Shutting down server - database error');
    process.exit(1);
  } else {
    // connect to minio
    initStorage().then((result) => {
      if (!result) {
        console.log('Shutting down server - storage error');
        process.exit(1);
      } else {
        if (process.env.SERVER_TYPE === 'worker') {
          // this container is a worker, start agenda
          (async function () {
            await agenda.start();
          })();
        } else {
          // this is an api container, start express server
          require('./server');
        }
      }
    });
  }
});
