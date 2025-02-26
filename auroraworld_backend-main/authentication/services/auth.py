from database.repository.users import UserRepository
from rest_framework.exceptions import ValidationError
from .bcrypt import BcryptService
from .token import TokenService

class AuthService:
    @staticmethod
    def register(data):
        username = data.get('username')
        password = BcryptService.hash_password(data.get('password'))

        UserRepository.create(username, password)

    @staticmethod
    def login(data):
        username = data.get('username')
        origin_password = data.get('password')

        user_info = UserRepository.get_user_by_username(username)

        result = BcryptService.check_password(user_info.password, origin_password)
        if not result:
            raise ValidationError('잘못된 비밀번호입니다.')

        access_token = TokenService.issue_access_token(user_info.id)
        refresh_token = TokenService.issue_refresh_token(user_info.id)

        hashed_refresh = BcryptService.hash_password(refresh_token)
        UserRepository.update_refresh(user_info.id, hashed_refresh)

        return {'access_token': access_token, 'refresh_token': refresh_token}
