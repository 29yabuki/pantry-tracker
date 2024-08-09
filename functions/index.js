/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()
export const authOnCreate =
functions.auth.user().onCreate(async user => {
    console.log(`Creating document for user ${user.uid}`)
    await firestore.collection('users').doc(user.uid).set({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        credits: 5
    })
})

export const authOnDelete =
functions.auth.user().onDelete(async user => {
    console.log(`Deleting document for user ${user.uid}`)
    await admin.firestore.collection('users').doc(user.uid).delete()
})