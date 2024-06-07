const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
admin.initializeApp();

const notificationCollection = "notificacionesPendientes";

// Creating a pubsub function with name `taskRunner`, memory `512MB` and schedule for 1 minute
exports.taskRunner = functions.runWith({ memory: '512MB' }).pubsub.schedule('* * * * *').onRun(async context => {

    // Current Timestamp
    const now = admin.firestore.Timestamp.now()

    // Query all documents ready to perform
    const query = firestore().collection(notificationCollection).where('fecha', '<=', now).where('sent', '==', false).where('cancel', '==', false)

    const tasks = await query.get()

    // Jobs to execute
    const jobs = [];

    tasks.forEach(async snapshot => {
        // destruct data from firebase document
        const { titulo, body, grupos, notId, tab } = snapshot.data()

        // using firebase-admin messaging function to send notification to our subscribed topic i.e. `all` with required `data`/payload
        const job = await admin.messaging().send({
            notification: {
                title: titulo,
                body: body
            },
            data: {
    id: notId,
    tab: tab,
  },
        android: {
            notification: {
                sound: "default",
                notification_count: 1
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: "default",
                    badge: 1
                }
            }
        },
            condition: `'${grupos}' in topics`
        })

        if (job.length != 0) {
            console.log('Notification Sent');
            // updating firestore notification document's `sent` to true. 
            firestore().collection(notificationCollection).doc(snapshot.id).update({ 'sent': true });
        }
        console.log(`Message sent:: ${job}`);

        jobs.push(job)
    })
})

// Nueva función para actualizar el conteo de usuarios
exports.updateUserCounts = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
    const codigosSnapshot = await firestore().collection('codigos').doc('codigo').get();
    const codigos = codigosSnapshot.data().codigo;

    for (const code of codigos) {
        const usersSnapshot = await firestore().collection('Usuarios').where('code', '==', code).get();
        const userCount = usersSnapshot.size;

        await firestore().collection('totaldeusuarios').doc(code).set({
            count: userCount
        }, { merge: true });
    }

    console.log('User counts updated successfully');
});

// Funcion para registrar las visitas por usuario
exports.registerUserVisit = functions.https.onCall(async (data, context) => {
  const { userId, code } = data;

  if (!userId || !code) {
    console.error('Invalid arguments. userId or code is missing.');
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with the userId and code.');
  }

  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  try {
    const userVisitDocRef = admin.firestore()
      .collection(code)
      .doc('datos')
      .collection('visitasdiarias')
      .doc(dateString)
      .collection('users')
      .doc(userId);

    const dailyVisitsDocRef = admin.firestore()
      .collection(code)
      .doc('datos')
      .collection('visitasdiarias')
      .doc(dateString);

    const userVisitDoc = await userVisitDocRef.get();

    if (!userVisitDoc.exists) {
      console.log(`Recording visit for user ${userId} on ${dateString}`);
      // If the user's visit is not recorded for today, record it and increment the count
      await userVisitDocRef.set({ visited: true });
      await dailyVisitsDocRef.set({
        date: dateString,
        count: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
      console.log(`Visit recorded and count incremented for code ${code} on ${dateString}`);
    } else {
      console.log(`User ${userId} has already visited on ${dateString}`);
    }
  } catch (error) {
    console.error('Error recording user visit:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred while recording the visit.');
  }
});