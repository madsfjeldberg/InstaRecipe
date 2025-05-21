import B2 from 'backblaze-b2';

const b2Client = new B2({
  accountId: process.env.BACKBLAZE_ACCOUNT_ID,
  applicationKey: process.env.BACKBLAZE_API_KEY,
});

export default b2Client;
