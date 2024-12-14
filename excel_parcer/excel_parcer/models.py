from django.db import models

class ExcelType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    start_row = models.IntegerField(default=1)
    start_column = models.IntegerField(default=1)
    columns = models.JSONField()  # [{"name": "ColumnName", "type": "str/int/float/date"}]

    def __str__(self):
        return self.name


class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    excel_type = models.ForeignKey(ExcelType, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='PENDING')  # PENDING, SUCCESS, FAILED
    errors = models.JSONField(null=True, blank=True)  # Хранение ошибок, если есть

