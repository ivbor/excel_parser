"""
URL configuration for excel_parcer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ExcelTypeViewSet,\
     ExcelUploadView, TaskStatusView, DownloadFileView, FileListView

from django.contrib import admin
from django.urls import path

router = DefaultRouter()
router.register(r'excel-types', ExcelTypeViewSet, basename='excel-type')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('upload/', ExcelUploadView.as_view(), name='upload'),
    path('tasks/<str:task_id>/', TaskStatusView.as_view(), name='task-status'),
    path('download/<int:file_id>/', DownloadFileView.as_view(), name='download'),
    path('files/', FileListView.as_view(), name='file-list')
]

urlpatterns += router.urls