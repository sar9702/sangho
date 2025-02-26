from rest_framework import serializers
from database.model.weblinks import WebLink

class WeblinkCreateSerializer(serializers.Serializer):
    url = serializers.URLField(max_length=255)
    name = serializers.CharField(max_length=255)
    category = serializers.ChoiceField(choices=[choice[0] for choice in WebLink._meta.get_field('category').choices])

class WeblinkUpdateSerializer(serializers.Serializer):
    weblink_id = serializers.IntegerField() 
    url = serializers.URLField(max_length=255)
    name = serializers.CharField(max_length=255)
    category = serializers.ChoiceField(choices=[choice[0] for choice in WebLink._meta.get_field('category').choices])

class WeblinkDeleteSerializer(serializers.Serializer):
    weblink_id = serializers.IntegerField() 
