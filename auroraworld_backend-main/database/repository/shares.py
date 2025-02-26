from rest_framework.exceptions import NotFound, ValidationError
from django.db.models import Q
from ..model.shares import Share

class ShareRepository:
    @staticmethod
    def get_share_by_user_with_weblink(user, weblink):
        try:
            share = Share.objects.get(shared_with_user=user, shared_by_weblink=weblink)
            return share
        except Share.DoesNotExist:
            raise NotFound(f"해당하는 웹링크 공유를 찾을 수 없습니다.")

    @staticmethod
    def get_share_by_shared_with_user(shared_with_user, keyword, category):
        filter_conditions = Q(shared_with_user=shared_with_user)
        
        if keyword:
            filter_conditions &= Q(shared_by_weblink__name__icontains=keyword)

        if category:
            filter_conditions &= Q(shared_by_weblink__category=category)

        shares = Share.objects.filter(filter_conditions)
        return shares

    @staticmethod
    def get_shares_by_weblink_id(weblink):
        shares = Share.objects.filter(shared_by_weblink=weblink)
        if not shares.exists():
            raise NotFound(f"해당하는 웹링크 공유를 찾을 수 없습니다.")
        return shares

    @staticmethod
    def create_share(inputdata):
        Share.objects.create(**inputdata)

    @staticmethod
    def update_share(user_id, weblink_id, permission):
        result = Share.objects.filter(shared_with_user=user_id, shared_by_weblink=weblink_id).update(permission=permission) 

        if not result:
            raise ValidationError("웹링크 공유 변경이 실패했습니다.")
        
    @staticmethod
    def delete_share(user_id, weblink_id):
        result = Share.objects.filter(shared_with_user=user_id, shared_by_weblink=weblink_id).delete() 

        if not result:
            raise ValidationError("웹링크 공유 변경이 실패했습니다.")
