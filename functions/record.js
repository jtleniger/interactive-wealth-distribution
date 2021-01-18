const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.GCP_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async function(event) {
  const { current: newCurrentData, ideal: newIdealData } = JSON.parse(event.body);

  const dataRef = db.collection('data');

  const currentDoc = await dataRef.doc('current').get();
  const idealDoc = await dataRef.doc('ideal').get();

  if (!currentDoc.exists || !idealDoc.exists) {
    if (!currentDoc.exists) {
      await currentDoc.set({
        count: 1,
        values: newCurrentData
      });
    }
  
    if (!idealDoc.exists) {
      await idealDoc.set({
        count: 1,
        values: newIdealData
      });
    }

    return {
      statusCode: 200
    };
  }

  let oldCurrentData = currentDoc.data();
  let oldIdealData = idealDoc.data();

  oldCurrentData.count++;
  oldIdealData.count++;

  await currentDoc.set({
    count: oldCurrentData.count,
    values: oldCurrentData.map((val, idx) => val + ((newCurrentData[idx] - val) / oldCurrentData.count))
  })

  await idealDoc.set({
    count: oldIdealData.count,
    values: oldIdealData.map((val, idx) => val + ((newIdealData[idx] - val) / oldIdealData.count))
  })

  return {
      statusCode: 200
  };
}