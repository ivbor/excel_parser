from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers \
    import FileUploadParser, MultiPartParser, FormParser

from .serializers import ExcelTypeSerializer, UploadedFileSerializer
from .models import UploadedFile, ExcelType
from .tasks import process_excel  # Celery task
from celery.result import AsyncResult
from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt


class FileListView(APIView):
    def get(self, request):
        files = UploadedFile.objects.all()
        serializer = UploadedFileSerializer(files, many=True)
        return Response(serializer.data)

class DownloadFileView(APIView):
    def get(self, request, file_id):
        try:
            uploaded_file = UploadedFile.objects.get(id=file_id)
        except UploadedFile.DoesNotExist:
            return Response({"error": "File not found"}, status=404)

        return FileResponse(uploaded_file.file, as_attachment=True)

class TaskStatusView(APIView):
    def get(self, request, task_id):
        task_result = AsyncResult(task_id)
        return Response({"task_id": task_id, "status": task_result.status,
                         "result": task_result.result})

class ExcelUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @csrf_exempt
    def options(self, request, *args, **kwargs):
        response = Response()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Disposition'
        return response

    @csrf_exempt
    def post(self, request, format=None):
        try:
            file = request.FILES['file']
            excel_type_id = request.data.get('excel_type_id')
            name = request.data.get('name')

            # Check if ExcelType exists
            try:
                excel_type = ExcelType.objects.get(id=excel_type_id)
            except ExcelType.DoesNotExist:
                return Response({"error": "Invalid Excel type ID"}, status=400)

            # Save the file with status PENDING
            uploaded_file = UploadedFile.objects.create(file=file, name=name, excel_type=excel_type, status='PENDING')
            
            # Launch the Celery task (async)
            task = process_excel.delay(uploaded_file.id, excel_type_id)
            
            # Return the task_id and file_id; don't attempt to set COMPLETED here
            return Response({"task_id": task.id, "file_id": uploaded_file.id})
        except Exception as e:
            # If something goes wrong before the task is launched
            return Response({"error": str(e)}, status=500)

class ExcelTypeViewSet(ModelViewSet):
    queryset = ExcelType.objects.all()
    serializer_class = ExcelTypeSerializer
