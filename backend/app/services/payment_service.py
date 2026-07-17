import httpx
from app.core.config import settings


async def initiate_mobile_money(telephone: str, montant: float, reference: str) -> dict:
    url = "https://api.africastalking.com/mobile/checkout/request"
    headers = {
        "apiKey": settings.AT_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    payload = {
        "username": settings.AT_USERNAME,
        "productName": "Luxe Drive",
        "phoneNumber": telephone,
        "currencyCode": "XOF",
        "amount": montant,
        "metadata": {"reference": reference},
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=payload)
        return response.json()
