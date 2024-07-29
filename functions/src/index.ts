import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { WebClient } from "@slack/web-api";

admin.initializeApp();

const slackToken = functions.config().slack.token;
const slackClient = new WebClient(slackToken);

const corsHandler = cors({ origin: true });

const withCors = (handler: (req: functions.Request, res: functions.Response) => any) => {
  return (req: functions.Request, res: functions.Response) => {
    return corsHandler(req, res, () => handler(req, res));
  };
};

const withCorsOnCall = (handler: (data: any, context: functions.https.CallableContext) => any) => {
  return async (data: any, context: functions.https.CallableContext) => {
    return handler(data, context);
  };
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

export const sendSlackMessage = functions.https.onCall(withCorsOnCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Solo usuarios autenticados pueden enviar mensajes.");
  }

  const { text } = data;
  const userId = context.auth.uid;

  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();

    await slackClient.chat.postMessage({
      channel: "C07CRE01WDUs",
      text: `${userData?.role}: ${text}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar mensaje a Slack:", error);
    throw new functions.https.HttpsError("internal", "Error al enviar mensaje a Slack");
  }
}));

export const sendFirebaseMessage = functions.https.onRequest(withCors(async (req, res) => {
  const { challenge, event } = req.body;

  if (challenge) {
    res.send({ challenge });
    return;
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
}));

export const notifyMessageRecipient = functions.https.onCall(withCorsOnCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado para realizar esta acción.");
  }

  const { conversationId, senderId, text } = data;

  try {
    const conversationDoc = await admin.firestore().collection("conversations").doc(conversationId).get();
    const conversation = conversationDoc.data();

    if (!conversation) {
      throw new functions.https.HttpsError("not-found", "No se encontró la conversación.");
    }

    const recipientId = conversation.participants.find((id: string) => id !== senderId);

    if (!recipientId) {
      throw new functions.https.HttpsError("not-found", "No se encontró el destinatario del mensaje.");
    }

    const recipientDoc = await admin.firestore().collection("users").doc(recipientId).get();
    const recipientData = recipientDoc.data();

    if (!recipientData || !recipientData.fcmToken) {
      console.log("No se encontró el token FCM del destinatario.");
      return { success: false, reason: "No FCM token" };
    }

    const message = {
      notification: {
        title: "Nuevo mensaje",
        body: `Tienes un nuevo mensaje: ${text.substring(0, 50)}...`,
      },
      token: recipientData.fcmToken,
    };

    await admin.messaging().send(message);

    console.log("Notificación enviada con éxito");
    return { success: true };
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
    throw new functions.https.HttpsError("internal", "Error al enviar la notificación.");
  }
}));

export const sendInvitation = functions.https.onCall(withCorsOnCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado para realizar esta acción.");
  }

  const { email } = data;
  const token = uuidv4();

  try {
    await admin.firestore().collection("invitations").doc(token).set({
      email,
      token,
      used: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const mailOptions = {
      from: `Tu Nombre <${functions.config().gmail.email}>`,
      to: email,
      subject: "Invitación para registro",
      html: `<p>Has sido invitado a registrarte. Por favor, usa el siguiente enlace para completar tu registro:</p>
             <p><a href="${functions.config().app.url}/register?token=${token}">Registro</a></p>
             <p>Este enlace solo es válido para un uso.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado a:", email);

    return { success: true };
  } catch (error) {
    console.error("Error al enviar la invitación:", error);
    throw new functions.https.HttpsError("internal", "Error al enviar la invitación.");
  }
}));
