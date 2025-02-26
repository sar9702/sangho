from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from authentication.permissions import IsAuthenticatedCustom
from .serializers import WeblinkCreateSerializer, WeblinkUpdateSerializer, WeblinkDeleteSerializer
from .services.weblink import WebLinkService
from .services.search import SearchService
from .services.share import ShareService

@api_view(['POST'])
@permission_classes([IsAuthenticatedCustom])
def create_weblink(request):
    serializer = WeblinkCreateSerializer(data=request.data)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')

    try:
        WebLinkService.create_weblink(serializer.validated_data, request.user)
        return Response({'message': '웹링크가 성공적으로 추가되었습니다.'}, status.HTTP_201_CREATED)
    except Exception as e: 
        raise e

@api_view(['PATCH'])
@permission_classes([IsAuthenticatedCustom])
def update_weblink(request):
    serializer = WeblinkUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')

    try:
        WebLinkService.can_user_edit_weblink(serializer.validated_data, request.user)
        return Response({'message': '웹링크가 성공적으로 변경되었습니다.'}, status.HTTP_200_OK)
    except Exception as e: 
        raise e

@api_view(['DELETE'])
@permission_classes([IsAuthenticatedCustom])
def delete_weblink(request):
    serializer = WeblinkDeleteSerializer(data=request.data)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')

    try:
        WebLinkService.delete_weblink(serializer.validated_data, request.user)
        return Response({'message': '웹링크가 성공적으로 삭제되었습니다.'}, status.HTTP_200_OK)
    except Exception as e: 
        raise e

@api_view(['GET'])
@permission_classes([IsAuthenticatedCustom])
def search_weblink(request):
    category = request.GET.get('category')
    keyword = request.GET.get('keyword')
    
    response = SearchService.get_weblink(category, keyword, request.user)
    return Response(response, status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticatedCustom])
def search_share_user(request):
    weblink_id = request.GET.get('weblinkId')

    response = SearchService.search_share_user(weblink_id, request.user)
    return Response(response, status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticatedCustom])
def search_user(request):
    keyword = request.GET.get('keyword')

    response = SearchService.search_user(keyword, request.user)
    return Response(response, status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticatedCustom])
def create_share(request):
    try:
        ShareService.create_share(request.data, request.user)
        return Response({'message': '웹링크 공유가 성공적으로 추가되었습니다.'}, status.HTTP_201_CREATED)
    except Exception as e: 
        raise e

@api_view(['PATCH'])
@permission_classes([IsAuthenticatedCustom])
def update_share(request):
    try:
        ShareService.update_share(request.data, request.user)
        return Response({'message': '웹링크 공유가 성공적으로 변경되었습니다.'}, status.HTTP_200_OK)
    except Exception as e: 
        raise e

@api_view(['DELETE'])
@permission_classes([IsAuthenticatedCustom])
def delete_share(request):
    try:
        ShareService.delete_share(request.data, request.user)
        return Response({'message': '웹링크 공유가 성공적으로 삭제되었습니다.'}, status.HTTP_200_OK)
    except Exception as e: 
        raise e
