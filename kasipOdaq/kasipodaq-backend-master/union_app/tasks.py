import os
from union_app.celery import app

from . import models, tools


@app.task
def clean_files():
    file_ids = list(models.FileLink.objects.values_list('file_id', flat=True))
    file_names = list(models.File.objects.exclude(id__in=file_ids).values_list('hash', 'extension'))

    for file_name in file_names:
        file_name = file_name[0] + '.' + file_name[1]

        ftp_manager = tools.FTPManager()
        ftp_manager.remove_file('public', file_name)



