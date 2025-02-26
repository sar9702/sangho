from rest_framework.exceptions import NotFound, ValidationError
from django.db.models import Q

from ..model.users import User
from django.db import IntegrityError

class UserRepository:
    @staticmethod
    def get_user_by_id(id):
        try:
            user = User.objects.get(pk=id)
            return user
        except User.DoesNotExist:
            raise NotFound(f"아이디 {id}에 해당하는 사용자를 찾을 수 없습니다.")

    @staticmethod
    def get_user_by_username(username):
        try:
            user = User.objects.get(username=username)
            return user
        except User.DoesNotExist:
            raise NotFound(f"아이디 {username}에 해당하는 사용자를 찾을 수 없습니다.")


    @staticmethod
    def check_username(username):
        result = User.objects.filter(username=username).exists()
        
        if result:
            raise ValidationError(f"사용자 이름 '{username}'은 이미 존재합니다.")

    @staticmethod
    def create(username, password):
        try:
            User.objects.create(username=username, password=password)
        except IntegrityError:
            raise ValidationError("이미 사용 중인 아이디입니다.")
        
    @staticmethod
    def update_refresh(id, refresh):
        result = User.objects.filter(id=id).update(refresh=refresh) 

        if not result:
            raise ValidationError("refresh_token 변경이 실패했습니다.")

    @staticmethod
    def clear_refresh(id):
        result = User.objects.filter(id=id).update(refresh=b'auroraworld') 

        if not result:
            raise ValidationError("refresh_token 초기화에 실패했습니다.")
        
    @staticmethod
    def get_user_by_keyword(keyword):
        if keyword:
            filter_conditions = Q(username__icontains=keyword)
        
        weblinks = User.objects.filter(filter_conditions)
        return weblinks
