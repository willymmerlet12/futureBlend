import admin from "firebase-admin";
// path to service account
import ServiceAccount from "./credentials.json";

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount),
});

module.exports = admin;
