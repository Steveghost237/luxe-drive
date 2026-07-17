import httpx
from app.core.config import settings


async def send_sms(telephone: str, message: str) -> dict:
    url = "https://api.africastalking.com/version1/messaging"
    headers = {
        "apiKey": settings.AT_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    }
    data = {
        "username": settings.AT_USERNAME,
        "to": telephone,
        "message": message,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, data=data)
        return response.json()


async def send_otp_sms(telephone: str, otp: str) -> dict:
    message = f"Votre code de vérification Luxe Drive est : {otp}. Valable 10 minutes."
    return await send_sms(telephone, message)
