const admin = require("firebase-admin");

const serviceAccount = require("./private/cl-dev-pk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codelabz-dev.firebaseio.com"
});

const db = admin.firestore();
const rtdb = admin.database();

module.exports = {
  db,
  rtdb,
  admin
};
