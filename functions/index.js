const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");
const admin = require("firebase-admin");
admin.initializeApp();

// firebase collection name
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
        const { titulo, body, grupos } = snapshot.data()

        // using firebase-admin messaging function to send notification to our subscribed topic i.e. `all` with required `data`/payload
        const job = await admin.messaging().send({
            notification: {
                title: titulo,
                body: body,
            },
        android: {
            notification: {
                sound: "default"
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: "default"
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