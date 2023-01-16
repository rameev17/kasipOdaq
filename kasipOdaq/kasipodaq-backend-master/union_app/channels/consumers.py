from channels.generic.websocket import WebsocketConsumer

from asgiref.sync import async_to_sync
from django.db.models import Q

from rest_framework.authtoken.models import Token

from django.core.exceptions import ObjectDoesNotExist

from .. import models


class NotificationConsumer(WebsocketConsumer):
    def connect(self):

        key = self.scope['query_string'].decode("utf-8")

        if 'token' in key:
            key = key.replace('token=', '')
        else:
            self.close()
            return

        try:
            person = Token.objects.get(key=key).user.person

            async_to_sync(self.channel_layer.group_add)('person_' + str(person.id), self.channel_name)

            union = models.UnionMember.objects.get(Q(status=1) | Q(status=101), person=person).union

            async_to_sync(self.channel_layer.group_add)('union_' + str(union.id), self.channel_name)

            while union.parent is not None:
                union = union.parent
                async_to_sync(self.channel_layer.group_add)('union_' + str(union.id), self.channel_name)

            self.accept()

        except ObjectDoesNotExist:
            self.close()
            return

    def disconnect(self, code):
        self.close()

    def send_event(self, event):
        self.send(event['event_type'])
