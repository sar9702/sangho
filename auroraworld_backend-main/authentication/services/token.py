from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.conf import settings
from decouple import config
import jwt

class TokenService:
    @staticmethod
    def issue_access_token(id):
        expiration = timezone.localtime(timezone.now()) + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']        
        payload = {
            'type': 'access',
            'sub': str(id),
            'exp': expiration
        }

        token = jwt.encode(payload, config('JWT_ACCESS_SECRET'), algorithm='HS256')
        return token

    @staticmethod
    def issue_refresh_token(id):
        expiration = timezone.localtime(timezone.now()) + settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']   
        payload = {
            'type': 'refresh',
            'sub': str(id),
            'exp': expiration,
        }

        token = jwt.encode(payload, config('JWT_REFRESH_SECRET'), algorithm='HS256')
        return token

    @staticmethod
    def verify_access_token(token):
        try:
            payload = jwt.decode(token, config('JWT_ACCESS_SECRET'), algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('액세스 토큰이 만료되었습니다.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('유효하지 않은 액세스 토큰입니다.')


    @staticmethod
    def verify_refresh_token(token):
        try:
            payload = jwt.decode(token, config('JWT_REFRESH_SECRET'), algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('리프레시 토큰이 만료되었습니다.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('유효하지 않은 리프레시 토큰입니다.')
