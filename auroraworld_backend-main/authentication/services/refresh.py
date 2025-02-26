from rest_framework.exceptions import AuthenticationFailed, ValidationError
from database.repository.users import UserRepository
from .token import TokenService
from .bcrypt import BcryptService

class RefreshService:
    @staticmethod
    def refresh(token):
        if not token:
            raise AuthenticationFailed('Authorization 헤더가 필요합니다.')
        try:
            token = token.split('Bearer ')[1]
        except IndexError:
            raise AuthenticationFailed('Bearer 토큰 형식이 잘못되었습니다.')
        
        payload = TokenService.verify_refresh_token(token)
        user_info = UserRepository.get_user_by_id(payload['sub'])

        result = BcryptService.check_password(user_info.refresh, token)
        if not result:
            raise ValidationError('잘못된 refresh token입니다.')

        access_token = TokenService.issue_access_token(user_info.id)
        refresh_token = TokenService.issue_refresh_token(user_info.id)

        hashed_refresh = BcryptService.hash_password(refresh_token)
        UserRepository.update_refresh(user_info.id, hashed_refresh)

        return {'access_token': access_token, 'refresh_token': refresh_token}