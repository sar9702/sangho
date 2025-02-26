from django.core.validators import RegexValidator
from rest_framework import serializers

class AuthSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=255, 
        validators=[RegexValidator(regex='^(?!\d+$)[A-Za-z0-9]+$')]
    )
    password = serializers.CharField(max_length=255)

class UsernameSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=255, 
        validators=[RegexValidator(regex='^(?!\d+$)[A-Za-z0-9]+$')]
    )
    