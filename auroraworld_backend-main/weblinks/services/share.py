from rest_framework.exceptions import ValidationError
from database.repository.weblinks import WebLinkRepository
from database.repository.shares import ShareRepository
from database.repository.users import UserRepository
from django.db import transaction

class ShareService:
    @staticmethod
    @transaction.atomic
    def create_share(data, user):
        weblink_info = WebLinkRepository.get_weblink_by_id(data.get('weblinkId'))
        user_info = UserRepository.get_user_by_id(data.get('userId'))

        if user.id != weblink_info.created_by.id:
            raise ValidationError('웹링크를 생성할 권한이 없습니다.')

        create_data = {
            'shared_with_user': user_info,
            'shared_by_weblink': weblink_info,
            'permission': 'read'
        }

        ShareRepository.create_share(create_data)

        if data.get('isNewUser'):
            WebLinkRepository.update_weblink_by_shared(data.get('weblinkId'), True)

    @staticmethod
    def update_share(data, user):
        weblink_info = WebLinkRepository.get_weblink_by_id(data.get('weblinkId'))
        if user.id != weblink_info.created_by.id:
            raise ValidationError('웹링크를 수정할 권한이 없습니다.')

        ShareRepository.update_share(data.get('userId'), weblink_info.id, data.get('permission'))

    @staticmethod
    @transaction.atomic
    def delete_share(data, user):
        weblink_info = WebLinkRepository.get_weblink_by_id(data.get('weblinkId'))
        if user.id != weblink_info.created_by.id:
            raise ValidationError('웹링크를 삭제할 권한이 없습니다.')

        ShareRepository.delete_share(data.get('userId'), weblink_info.id)

        if data.get('isUserExist'):
            WebLinkRepository.update_weblink_by_shared(data.get('weblinkId'), False)
