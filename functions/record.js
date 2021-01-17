const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.GCP_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async function(event) {
  const { current, ideal } = JSON.parse(event.body);

  console.log(current);
  console.log(ideal);

  await db.collection('current').add({ current });
  await db.collection('ideal').add({ ideal });

  return {
      statusCode: 200
  };
}