from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

api_base = 'api/v1'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(f"{api_base}/user/", include("userauths.urls")),
    path(f"{api_base}/core/", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)