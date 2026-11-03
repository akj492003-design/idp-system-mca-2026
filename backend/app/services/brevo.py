import requests
from flask import current_app

BREVO_SMS_URL = "https://api.brevo.com/v3/transactionalSMS/send"
BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email"


def _headers():
    key = current_app.config.get("BREVO_API_KEY")
    if not key:
        raise RuntimeError("BREVO_API_KEY is not configured")
    return {"api-key": key, "accept": "application/json", "content-type": "application/json"}


def send_sms(phone, message):
    sender = current_app.config["BREVO_SMS_SENDER"]
    response = requests.post(BREVO_SMS_URL, headers=_headers(), json={
        "sender": sender, "recipient": phone, "content": message,
        "type": "transactional", "unicodeEnabled": True,
    }, timeout=15)
    response.raise_for_status()
    return response.json() if response.content else {}


def send_email(to_email, subject, html_content, text_content=None):
    sender = current_app.config.get("BREVO_EMAIL_SENDER")
    if not sender:
        raise RuntimeError("BREVO_EMAIL_SENDER is not configured")
    payload = {
        "sender": {"name": current_app.config.get("BREVO_EMAIL_SENDER_NAME", "IDP System"), "email": sender},
        "to": [{"email": to_email}], "subject": subject, "htmlContent": html_content,
    }
    if text_content:
        payload["textContent"] = text_content
    response = requests.post(BREVO_EMAIL_URL, headers=_headers(), json=payload, timeout=15)
    response.raise_for_status()
    return response.json() if response.content else {}
