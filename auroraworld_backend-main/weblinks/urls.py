from django.urls import path
from .views import create_weblink, update_weblink, delete_weblink, search_weblink, search_share_user, search_user, create_share, update_share, delete_share

urlpatterns = [
    path('', create_weblink, name='weblink-create'),
    path('update/', update_weblink, name='weblink-update'),
    path('delete/', delete_weblink, name='weblink-delete'),
    path('search', search_weblink, name='weblink-search'),
    path('search/user', search_user, name='weblink-search-user'),
    path('search/share/user', search_share_user, name='weblink-search-share-user'),
    path('share/', create_share, name='share-create'),
    path('share/update/', update_share, name='share-update'),
    path('share/delete/', delete_share, name='share-delete'),
]