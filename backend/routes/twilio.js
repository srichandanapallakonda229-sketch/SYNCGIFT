const express = require('express');
const router = express.Router();
const db = require('../db');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

const LOGS_FILE = path.join(__dirname, '../data/whatsapp_logs.json');

// Helper to log WhatsApp actions
function logWhatsappMessage(to, message, status, error = null) {
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }
  logs.push({
    timestamp: new Date().toISOString(),
    to,
    message,
    status, // 'Success', 'Failed', 'Simulated'
    error
  });
  // Keep only last 100 logs
  if (logs.length > 100) logs.shift();
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf8');
}

// Twilio Client Setup
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Inbound Twilio Call Webhook
router.post('/webhook/twilio-call', async (req, res) => {
  // Twilio calls send parameters in request body (urlencoded)
  const { CallStatus, From, To, CallSid } = req.body;
  console.log(`Twilio Call Webhook: Call SID ${CallSid}, Status: ${CallStatus}, From: ${From}`);

  const failureStatuses = ['no-answer', 'busy', 'failed', 'canceled'];

  if (failureStatuses.includes(CallStatus?.toLowerCase())) {
    try {
      const shopInfo = await db.getShopInfo();
      const busyMsg = shopInfo.whatsappSettings?.busyMessage || "Hello! Thank you for contacting UMA'S GIFTY. We are currently busy and unable to answer your call. We will contact you within 15–20 minutes. Thank you for your patience.";
      const isAutoReplyEnabled = shopInfo.whatsappSettings?.autoReplyOnNoAnswer !== false;

      if (isAutoReplyEnabled) {
        // Send WhatsApp Message
        const customerNumber = From; // Call initiator
        await sendWhatsAppNotification(customerNumber, busyMsg);
      }
    } catch (err) {
      console.error('Call webhook WhatsApp trigger failed:', err.message);
    }
  }

  // Respond to Twilio with standard empty TwiML response
  res.type('text/xml');
  res.send('<Response></Response>');
});

// Twilio Call Simulation Endpoint (for Admin / Developer testing)
router.post('/simulate-call', async (req, res) => {
  const { phoneNumber, status } = req.body;
  if (!phoneNumber || !status) {
    return res.status(400).json({ error: 'Missing phone number or call status' });
  }

  const failureStatuses = ['no-answer', 'busy', 'failed', 'canceled'];
  const logStatus = failureStatuses.includes(status.toLowerCase()) ? 'Triggered Auto-Reply' : 'Ignored (Call Answered)';

  let whatsappSent = false;
  let whatsappStatus = 'Skipped';
  let messageContent = '';

  try {
    const shopInfo = await db.getShopInfo();
    messageContent = shopInfo.whatsappSettings?.busyMessage || "Hello! Thank you for contacting UMA'S GIFTY. We are currently busy and unable to answer your call. We will contact you within 15–20 minutes. Thank you for your patience.";
    const isAutoReplyEnabled = shopInfo.whatsappSettings?.autoReplyOnNoAnswer !== false;

    if (failureStatuses.includes(status.toLowerCase()) && isAutoReplyEnabled) {
      if (twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
        // Send actual WhatsApp using Twilio
        await sendWhatsAppNotification(phoneNumber, messageContent);
        whatsappStatus = 'Success';
      } else {
        // Mock WhatsApp logging
        console.log(`[SIMULATED WHATSAPP] To: ${phoneNumber}, Message: "${messageContent}"`);
        whatsappStatus = 'Simulated';
        logWhatsappMessage(phoneNumber, messageContent, 'Simulated', 'Twilio credentials not configured. Logged simulation.');
      }
      whatsappSent = true;
    }

    res.status(200).json({
      success: true,
      message: `Call simulation processed. Status: ${status}`,
      logStatus,
      whatsappSent,
      whatsappStatus,
      messageContent
    });
  } catch (error) {
    console.error('Simulate call error:', error.message);
    logWhatsappMessage(phoneNumber, messageContent, 'Failed', error.message);
    res.status(500).json({ error: 'Failed to process call simulation', details: error.message });
  }
});

// GET Twilio WhatsApp Logs
router.get('/logs', async (req, res) => {
  if (fs.existsSync(LOGS_FILE)) {
    try {
      const logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
      return res.status(200).json(logs.reverse());
    } catch (e) {
      return res.status(200).json([]);
    }
  }
  res.status(200).json([]);
});

// Helper Function to Send WhatsApp Notification
async function sendWhatsAppNotification(to, body) {
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // default Twilio sandbox number
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  if (!twilioClient) {
    console.log(`[MOCK WHATSAPP] Send to ${formattedTo} from ${fromWhatsApp}: "${body}"`);
    logWhatsappMessage(formattedTo, body, 'Simulated', 'Twilio client not initialized (no API keys)');
    return;
  }

  try {
    const message = await twilioClient.messages.create({
      from: fromWhatsApp,
      body: body,
      to: formattedTo
    });
    console.log(`Twilio WhatsApp sent. SID: ${message.sid}`);
    logWhatsappMessage(formattedTo, body, 'Success');
    return message;
  } catch (error) {
    console.error(`Twilio WhatsApp send error:`, error.message);
    logWhatsappMessage(formattedTo, body, 'Failed', error.message);
    throw error;
  }
}

module.exports = router;
