const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.GCP_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async function(event) {
  const { current: currentDataPoint, ideal: idealDataPoint } = JSON.parse(event.body);

  console.log(`New data point, current: ${currentDataPoint}, ideal: ${idealDataPoint}`);

  const dataRef = db.collection('data');

  const currentDoc = await dataRef.doc('current').get();
  const idealDoc = await dataRef.doc('ideal').get();

  if (!currentDoc.exists || !idealDoc.exists) {
    if (!currentDoc.exists) {
      console.log('Missing current doc.');

      await dataRef.doc('current').set({
        count: 1,
        values: currentDataPoint
      });
    }
  
    if (!idealDoc.exists) {
      console.log('Missing ideal doc.');

      await dataRef.doc('ideal').set({
        count: 1,
        values: idealDataPoint
      });
    }

    return {
      statusCode: 200
    };
  }

  let existingCurrentData = currentDoc.data();
  let existingIdealData = idealDoc.data();

  console.log('Exsting data:');
  console.log(`Current: ${JSON.stringify(existingCurrentData)}`);
  console.log(`Ideal: ${JSON.stringify(existingIdealData)}`);

  existingCurrentData.count++;
  existingIdealData.count++;

  let newCurrentData = {
    count: existingCurrentData.count,
    values: existingCurrentData.values.map((val, idx) => val + ((currentDataPoint[idx] - val) / existingCurrentData.count))
  };

  let newIdealData = {
    count: existingIdealData.count,
    values: existingIdealData.values.map((val, idx) => val + ((idealDataPoint[idx] - val) / existingIdealData.count))
  };

  console.log('Computed new data:');
  console.log(`Current: ${JSON.stringify(newCurrentData)}`);
  console.log(`Ideal: ${JSON.stringify(newIdealData)}`);

  await dataRef.doc('current').set(newCurrentData);
  await dataRef.doc('ideal').set(newIdealData);

  return {
      statusCode: 200
  };
}