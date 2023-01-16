from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path


schema_view = get_schema_view(
    openapi.Info(
        title='Kasipodaq API Documentation',
        default_version='v1',
        description='API документация по проекту Yntymaq Kasipodaq'
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/v1/', include('union_app.api.urls')),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger')
]
