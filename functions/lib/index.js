"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitation = exports.notifyMessageRecipient = exports.sendFirebaseMessage = exports.sendSlackMessage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const web_api_1 = require("@slack/web-api");
admin.initializeApp();
const slackToken = functions.config().slack.token;
const slackClient = new web_api_1.WebClient(slackToken);
const corsHandler = (0, cors_1.default)({ origin: true });
const withCors = (handler) => {
    return (req, res) => {
        return corsHandler(req, res, () => handler(req, res));
    };
};
const withCorsOnCall = (handler) => {
    return async (data, context) => {
        return handler(data, context);
    };
};
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: functions.config().gmail.email,
        pass: functions.config().gmail.password,
    },
});
exports.sendSlackMessage = functions.https.onCall(withCorsOnCall(async (data, context) => {
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
    }
    catch (error) {
        console.error("Error al enviar mensaje a Slack:", error);
        throw new functions.https.HttpsError("internal", "Error al enviar mensaje a Slack");
    }
}));
exports.sendFirebaseMessage = functions.https.onRequest(withCors(async (req, res) => {
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
        }
        catch (error) {
            console.error("Error al guardar mensaje de Slack en Firebase:", error);
            res.sendStatus(500);
        }
    }
    else {
        res.sendStatus(200);
    }
}));
exports.notifyMessageRecipient = functions.https.onCall(withCorsOnCall(async (data, context) => {
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
        const recipientId = conversation.participants.find((id) => id !== senderId);
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
    }
    catch (error) {
        console.error("Error al enviar la notificación:", error);
        throw new functions.https.HttpsError("internal", "Error al enviar la notificación.");
    }
}));
exports.sendInvitation = functions.https.onCall(withCorsOnCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado para realizar esta acción.");
    }
    const { email } = data;
    const token = (0, uuid_1.v4)();
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
    }
    catch (error) {
        console.error("Error al enviar la invitación:", error);
        throw new functions.https.HttpsError("internal", "Error al enviar la invitación.");
    }
}));
