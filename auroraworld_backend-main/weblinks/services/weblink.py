from rest_framework.exceptions import ValidationError
from .image_url import ImageUrlService
from database.repository.weblinks import WebLinkRepository
from database.repository.shares import ShareRepository

class WebLinkService:
    @staticmethod
    def create_weblink(data, user):
        image_url = ImageUrlService.generate_image_url(data.get('url'))

        inputdata = {
            'created_by': user, 
            'name': data.get('name'),  
            'url': data.get('url'),
            'category': data.get('category'),
            'image_url': image_url,
        }

        WebLinkRepository.create_weblink(inputdata)

    @staticmethod
    def can_user_edit_weblink(data, user):
        weblink_info = WebLinkRepository.get_weblink_by_id(data.get('weblink_id'))

        if weblink_info.created_by.id == user.id or ShareRepository.get_share_by_user_with_weblink(user, weblink_info).permission == 'write':
            return WebLinkService.__update_weblink(data, weblink_info)
        
        raise ValidationError('공유된 웹링크를 변경할 권한이 없습니다.')

    @staticmethod
    def __update_weblink(data, weblink_info):
        new_image_url = ImageUrlService.generate_image_url(data.get('url')) if data.get('url') != weblink_info.url else weblink_info.image_url

        update_data = {
            'name': data.get('name'),
            'url': data.get('url'),
            'category': data.get('category'),
            'image_url': new_image_url, 
        }

        WebLinkRepository.update_weblink(data.get('weblink_id'), update_data)

    @staticmethod
    def delete_weblink(data, user):
        weblink_info = WebLinkRepository.get_weblink_by_id(data.get('weblink_id'))

        if weblink_info.created_by.id != user.id:
            raise ValidationError('웹링크를 삭제할 권한이 없습니다.')

        WebLinkRepository.delete_weblink(weblink_info.id)
