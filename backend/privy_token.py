from privy import PrivyAPI
import dotenv
import jwt

env = dotenv.dotenv_values('.env')


app_id = env['PRIVY_APP_ID']

app_secret = env['PRIVY_APP_SECRET']

JWKS = f'https://auth.privy.io/api/v1/apps/{app_id}/jwks.json'

access_token = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InV5cTVoNXVPbjdjZXVyZkVMNkc4emw2MXh3Yzh0N3h4TlFTZ1NRak9mcW8ifQ.eyJzaWQiOiJjbWZ3bmlyd2owMWNnanIwYzFpOHowMnAwIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3NTg2Mzc3NzAsImF1ZCI6ImNtZmo1aGZicTAwN2xsNTBjdGo4Z250dm0iLCJzdWIiOiJkaWQ6cHJpdnk6Y21mdzdmZ2txMDBsZGp5MGN3Nzdkemx6NiIsImV4cCI6MTc1ODY0MTM3MH0.kQn_Igv17re_eVOUAnUmXqEPTmhf5skm9PdfGzfWYxTeXe1Ojs9h3rk9wk0qeOy9hzI-EFrZD0e36XBj0T6r3w'

try:
    decoded = jwt.decode(
            access_token,
            options={"verify_aud": False},
            key=jwt.PyJWKClient(JWKS).get_signing_key_from_jwt(access_token).key,
            algorithms=['ES256']
        )
    print(decoded.get('sub'))
except Exception as e:
    print(f"error: {str(e)}")