import { agenda } from './worker';
import { initStorage } from './storage';
import { connectDatabase } from './database';

(async () => {
  try {
    await connectDatabase();
    await initStorage();
    if (process.env.SERVER_TYPE === 'worker') {
      // this container is a worker, start agenda
      await agenda.start();
    } else {
      // this is an api container, start express server
      require('./server');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
