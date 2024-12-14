from rest_framework import serializers
from .models import ExcelType, UploadedFile

class ExcelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExcelType
        fields = '__all__'


class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'

