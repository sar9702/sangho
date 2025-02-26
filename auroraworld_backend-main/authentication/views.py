from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from database.repository.users import UserRepository
from .permissions import IsAuthenticatedCustom
from .services.auth import AuthService
from .services.refresh import RefreshService
from .serializers import AuthSerializer, UsernameSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = AuthSerializer(data=request.data)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')

    try:
        AuthService.register(serializer.validated_data)
        return Response({'message': '회원가입이 성공적으로 처리되었습니다.'}, status.HTTP_201_CREATED)
    except Exception as e: 
        raise e

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = AuthSerializer(data=request.data)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')
    
    try:
        tokens = AuthService.login(serializer.validated_data)
        return Response(tokens, status.HTTP_200_OK) 
    except Exception as e: 
        raise e

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh(request):
    refresh = request.headers.get('Authorization')

    try:
        tokens = RefreshService.refresh(refresh)
        return Response(tokens, status.HTTP_200_OK) 
    except Exception as e: 
        raise e

@api_view(['POST'])
@permission_classes([IsAuthenticatedCustom])
def logout(request):
    UserRepository.clear_refresh(request.user.id)
    return Response({'message': '로그아웃이 성공적으로 처리되었습니다.'}, status.HTTP_200_OK) 

@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request):
    serializer = UsernameSerializer(data=request.query_params)
    if not serializer.is_valid():
        raise ValidationError('유효성 검사에 실패했습니다. 입력값을 확인해주세요.')
    
    UserRepository.check_username(serializer.validated_data['username'])
    return Response({'message': '사용 가능한 아이디입니다.'}, status.HTTP_200_OK) 
