const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { WebClient } = require("@slack/web-api");

admin.initializeApp();

const slackToken = functions.config().slack.token;
const slackClient = new WebClient(slackToken);

exports.sendSlackMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Solo usuarios autenticados pueden enviar mensajes.",
    );
  }

  const { text } = data;
  const userId = context.auth.uid;

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();

    await slackClient.chat.postMessage({
      channel: "C07CRE01WDUs", // Reemplaza con el ID del canal de Slack
      text: `${userData.role}: ${text}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar mensaje a Slack:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error al enviar mensaje a Slack",
    );
  }
});

exports.sendFirebaseMessage = functions.https.onRequest(async (req, res) => {
  const { challenge, event } = req.body;

  if (challenge) {
    return res.send({ challenge });
  }

  if (event && event.type === "message") {
    try {
      await admin.firestore().collection("messages").add({
        text: event.text,
        sender: "Slack",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.sendStatus(200);
    } catch (error) {
      console.error("Error al guardar mensaje de Slack en Firebase:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(200);
  }
});
