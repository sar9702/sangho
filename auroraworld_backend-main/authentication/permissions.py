from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from .services.token import TokenService
from database.repository.users import UserRepository

class IsAuthenticatedCustom(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            raise AuthenticationFailed('Authorization 헤더가 필요합니다.')
        try:
            token = auth_header.split('Bearer ')[1]
        except IndexError:
            raise AuthenticationFailed('Bearer 토큰 형식이 잘못되었습니다.')

        payload = TokenService.verify_access_token(token)
        user = UserRepository.get_user_by_id(payload['sub'])

        request.user = user
        return True
