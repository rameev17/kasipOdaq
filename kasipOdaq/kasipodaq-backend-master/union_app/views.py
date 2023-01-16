import builtins
import json

import requests
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.views.decorators.cache import never_cache

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny

from yntymaq_union import settings
from .business import entities
from .business import use_cases
from .business import ports

from .api import presenters
from .api import validators
from .api import permissions
from .tools import PictureManager


class APIViewSet(ViewSet):
    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)
        self.max_depth = 1
        self.needed_fields = None

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)

        self.max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1
        self.needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    @staticmethod
    def set_person(request, port):
        if request.user.is_authenticated:
            port.person_entity = entities.Person()
            port.person_entity.resource_id = request.auth.user.person.id

    @staticmethod
    def add_attributes(entity, request_field, field_value):
        entity.attributes[request_field] = field_value


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def authorize(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'password'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    phone = request.data['phone']
    phone = f'7{str(phone)[1:]}'

    user_entity = entities.User()
    user_entity.person = entities.Person()
    user_entity.password = request.data['password']
    user_entity.phone = phone
    user_entity.ip = ip

    try:
        auth_user = user_use_case.authorize(user_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(presenter.to_dict_response(auth_user,
                                               max_depth=max_depth,
                                               needed_fields=['resource_id', 'phone', 'token', 'status']))


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def verify_captcha(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'token'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    request_data = {
        'secret': settings.RECAPTCHA,
        'response': request.data['token']
    }

    response = requests.post('https://www.google.com/recaptcha/api/siteverify', request_data)

    return Response({'success': response.json()['success']}, 200)


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def register(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'first_name',
        'family_name',
        'password',
        'uid',
        'sms_code',
        'birthday',
        'sex',
        'physical_address'
    ])

    errors += validators.PasswordValidator.validate(request.data['password'])

    if len(errors) > 0:
        return Response(errors, 422)

    phone = request.data['phone']
    phone = f'7{str(phone)[1:]}'

    user_entity = entities.User()
    user_entity.password = request.data['password']
    user_entity.phone = phone
    user_entity.person = entities.Person()
    user_entity.person.first_name = request.data['first_name']
    user_entity.person.family_name = request.data['family_name']
    user_entity.person.individual_number = request.data['uid']  # TODO: ПОПРАВИТЬ
    user_entity.person.birthday = request.data['birthday']
    user_entity.person.sex = request.data['sex']
    user_entity.person.physical_address = request.data['physical_address']

    allowed_fields = ['job_position', 'patronymic', 'middle_name', 'email']

    for request_field in request.data:
        if request_field in allowed_fields:
            setattr(user_entity.person, request_field, request.data[request_field])

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        user_id = user_use_case.register(request.data['sms_code'], user_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200, headers={
        'X-Entity-Id': user_id
    })


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def create_union_member(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'first_name',
        'family_name',
        'individual_number',
        'birthday',
        'sex',
        'physical_address'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    phone = request.data['phone']
    phone = f'7{str(phone)[1:]}'

    user_entity = entities.User()
    user_entity.phone = phone
    user_entity.person = entities.Person()
    user_entity.person.first_name = request.data['first_name']
    user_entity.person.family_name = request.data['family_name']
    user_entity.person.individual_number = request.data['individual_number']
    user_entity.person.birthday = request.data['birthday']
    user_entity.person.sex = request.data['sex']
    user_entity.person.physical_address = request.data['physical_address']

    allowed_fields = ['job_position', 'patronymic', 'middle_name', 'email', 'picture_id']

    for request_field in request.data:
        if request_field in allowed_fields:
            setattr(user_entity.person, request_field, request.data[request_field])

    children = json.loads(request.data.get('children', '[]'))

    for child in children:
        if len(child['personal_code']) < 12:
            return Response({'message': 'Длинна ИИН должна быть равна 12 символам'}, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context=context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        person_id = union_use_case.create_union_member(user_entity, union_port.person_entity.resource_id, children)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200, headers={
        'X-Entity-Id': person_id
    })


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def set_union_master(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'person_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        person_id = union_use_case.set_union_master(request.auth.user.person.id, request.data['person_id'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200, headers={
        'X-Entity-Id': person_id
    })


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def send_sms(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'method'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    phone = request.data['phone']
    phone = f'7{str(phone)[1:]}'

    sms_entity = entities.ShortMessage()
    sms_entity.phone = phone
    sms_entity.method = request.data['method']

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        sms_port = ports.SMSInputPort(request.auth.user.role, request.auth.user.id, context)
        sms_port.person_entity = entities.Person()
        sms_port.person_entity.resource_id = request.auth.user.person.id
    else:
        sms_port = ports.SMSInputPort(context=context)

    sms_use_case = use_cases.ShortMessageUseCase(sms_port)

    try:
        sms_use_case.send_sms(sms_entity, ip)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 201)


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def confirm_sms(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'sms_code'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        sms_port = ports.SMSInputPort(request.auth.user.role, request.auth.user.id, context)
        sms_port.person_entity = entities.Person()
        sms_port.person_entity.resource_id = request.auth.user.person.id
    else:
        sms_port = ports.SMSInputPort(context=context)

    sms_use_case = use_cases.ShortMessageUseCase(sms_port)

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    try:
        sms_use_case.confirm_sms(request.data['phone'], request.data['sms_code'], ip)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200)


@api_view(['PATCH'])
@permission_classes((AllowAny,))
@never_cache
def edit_setting(request, pk=None):
    allowed_fields = {
        'enable_notice': ('int', 'bool',),
        'language_code': ('str',)
    }

    settings_entity = entities.Settings()
    settings_entity.resource_id = pk

    for request_field in request.data:
        if request_field in allowed_fields:
            field_value = request.data[request_field]

            for func_name in allowed_fields[request_field]:
                field_value = getattr(builtins, func_name)(field_value)

            setattr(settings_entity, request_field, field_value)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        settings_port = ports.SettingsInputPort(request.auth.user.role, request.auth.user.id, context)
        settings_port.person_entity = entities.Person()
        settings_port.person_entity.resource_id = request.auth.user.person.id
    else:
        settings_port = ports.SettingsInputPort(context=context)

    settings_use_case = use_cases.SettingsUseCase(settings_port)

    try:
        settings_use_case.edit(settings_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 202)


@api_view(['POST'])
@never_cache
def join_union(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'union_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    person_entity = entities.Person()
    person_entity.resource_id = request.auth.user.person.id

    union_entity = entities.Union()
    union_entity.resource_id = request.data['union_id']

    files = []

    for file_id in request.data['files'].split(','):
        file = entities.File()
        file.resource_id = file_id

        files.append(file)

    union_entity.application.files = files

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        member_id = union_use_case.join(person_entity, union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200, headers={
        'X-Entity-Id': member_id
    })


@api_view(['POST'])
@never_cache
def create_union(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'association_id',
        'union_protocol_id',
        'union_position_id',
        'union_statement_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    for localization in request.data['localizations']:
        errors = validators.RequiredFieldsValidator.validate(localization, [
            'name',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

    if 'industry_id' not in request.data and 'root_union_id' not in request.data:
        error = {'message': f'Поля отрасль или родительский профсоюз необходимо заполнить'}
        return Response(error, 422)

    person_entity = entities.Person()
    person_entity.resource_id = request.auth.user.person.id

    union_entity = entities.Union()
    union_entity.localizations = request.data['localizations']
    union_entity.name = request.data['union_name']
    if 'industry_id' in request.data:
        union_entity.root_union.resource_id = request.data['industry_id']
    else:
        union_entity.root_union.resource_id = request.data['root_union_id']
    union_entity.association_union.resource_id = request.data['association_id']
    union_entity.application.protocol = request.data['union_protocol_id']
    union_entity.application.position = request.data['union_position_id']
    union_entity.application.statement = request.data['union_statement_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        member_id = union_use_case.create(person_entity, union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200, headers={
        'X-Entity-Id': member_id
    })


@api_view(['PATCH'])
@permission_classes((AllowAny,))
@never_cache
def restore_password(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'phone',
        'sms_code',
        'new_password'
    ])

    errors += validators.PasswordValidator.validate(request.data['new_password'])

    if len(errors) > 0:
        return Response(errors, 422)

    phone = request.data['phone']
    phone = f'7{str(phone)[1:]}'

    user_entity = entities.User()
    user_entity.phone = phone
    user_entity.password = request.data['new_password']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        user_use_case.restore_password(request.data['sms_code'], user_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 202)


@api_view(['PATCH'])
@never_cache
def change_password(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'new_password',
        'old_password'
    ])

    errors += validators.PasswordValidator.validate(request.data['new_password'])

    if len(errors) > 0:
        return Response(errors, 422)

    user_entity = entities.User()
    user_entity.old_password = request.data['old_password']
    user_entity.password = request.data['new_password']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        user_use_case.change_password(user_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 202)


@api_view(['POST'])
@never_cache
def import_members(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'file'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    file_entity = entities.File()
    file_entity.name = request.FILES['file'].name
    file_entity.size = request.FILES['file'].size
    file_entity.content_type = request.FILES['file'].content_type
    file_entity.content = request.FILES['file'].read()

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        unions_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.person.id, context)
        unions_port.person_entity = entities.Person()
        unions_port.person_entity.resource_id = request.auth.user.person.id
    else:
        unions_port = ports.UnionInputPort(context=context)

    unions_port.context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    unions_use_case = use_cases.UnionUseCase(unions_port)

    try:
        unions_use_case.import_members(file_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, status=201)


@api_view(['POST'])
@never_cache
def import_children(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'file'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    file_entity = entities.File()
    file_entity.name = request.FILES['file'].name
    file_entity.size = request.FILES['file'].size
    file_entity.content_type = request.FILES['file'].content_type
    file_entity.content = request.FILES['file'].read()

    if request.user.is_authenticated:
        unions_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        unions_port.person_entity = entities.Person()
        unions_port.person_entity.resource_id = request.auth.user.person.id
    else:
        unions_port = ports.UnionInputPort(context=context)

    unions_port.context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    unions_use_case = use_cases.UnionUseCase(unions_port)

    try:
        unions_use_case.import_children(file_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, status=201)


class UnionViewSet(APIViewSet):
    permission_classes = (AllowAny,)

    @swagger_auto_schema(operation_description='Получение списка профоюзов')
    def list(self, request):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None
        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = []

        union_entity = entities.Union()
        union_entity.page_number = request.query_params.get('page_number', 1)
        union_entity.count = request.query_params.get('count', 160)
        union_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        union_entity.search = request.query_params.get('search', None)

        if union_entity.search is not None and len(union_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            unions = union_use_case.get_list(union_entity, request.query_params.get('industry_id', None))
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(unions['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': unions['count'],
                'X-Pagination-Total-Count': unions['total_count'],
                'X-Pagination-Page-Count': unions['page_count'],
                'X-Pagination-Current-Page': unions['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр профсоюза')
    def retrieve(self, request, pk=None):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            union = union_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(union,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Обновление данных о профсоюзе')
    def partial_update(self, request, pk=None):
        union_entity = entities.Union()
        union_entity.resource_id = pk

        allowed_fields = {
            'picture_id': ('int',),
            'status': ('int',),
            'files': ()
        }

        union_entity.localizations = request.data.get('localizations', [])

        for localization in union_entity.localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(union_entity, request_field, field_value)

        files = []

        if hasattr(union_entity, 'files'):
            for file_id in request.data['files'].split(','):
                file = entities.File()
                file.resource_id = file_id

                files.append(file)

        union_entity.files = files

        if 'union_protocol_id' in request.data:
            union_entity.union_protocol_id = request.data['union_protocol_id']

        if 'union_position_id' in request.data:
            union_entity.union_position_id = request.data['union_position_id']

        if 'union_statement_id' in request.data:
            union_entity.union_statement_id = request.data['union_statement_id']

        if 'union_agreement_id' in request.data:
            union_entity.union_agreement_id = request.data['union_agreement_id']

        if 'union_sample_application_ids' in request.data:
            if request.data['union_sample_application_ids'] == '':
                union_entity.union_sample_applications_list = []
            else:
                union_entity.union_sample_applications_list = request.data['union_sample_application_ids'].split(',')
                union_entity.union_sample_applications_list = (int(x) for x in
                                                               union_entity.union_sample_applications_list if x != '')

        if 'entry_sample_id' in request.data:
            union_entity.entry_sample_id = request.data['entry_sample_id']

        if 'hold_sample_id' in request.data:
            union_entity.hold_sample_id = request.data['hold_sample_id']

        if 'position_sample_id' in request.data:
            union_entity.position_sample_id = request.data['position_sample_id']

        if 'protocol_sample_id' in request.data:
            union_entity.protocol_sample_id = request.data['protocol_sample_id']

        if 'statement_sample_id' in request.data:
            union_entity.statement_sample_id = request.data['statement_sample_id']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            union_use_case.edit(union_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)


@api_view(['GET'])
@never_cache
def unions_by_person(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    union_entity = entities.Union()
    union_entity.page_number = request.query_params.get('page_number', 1)
    union_entity.count = request.query_params.get('count', 22)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    person_id = request.query_params.get('person_id', request.auth.user.person.id)

    try:
        unions = union_use_case.unions_by_person(union_entity, person_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(
        presenter.to_list_response(unions['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
        headers={
            'X-Pagination-Count': unions['count'],
            'X-Pagination-Total-Count': unions['total_count'],
            'X-Pagination-Page-Count': unions['page_count'],
            'X-Pagination-Current-Page': unions['page_number']
        })


@api_view(['GET'])
@never_cache
def get_industries(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    union_entity = entities.Union()
    union_entity.page_number = request.query_params.get('page_number', 1)
    union_entity.count = request.query_params.get('count', 22)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        industries = union_use_case.get_industries(union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(
        presenter.to_list_response(industries['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
        headers={
            'X-Pagination-Count': industries['count'],
            'X-Pagination-Total-Count': industries['total_count'],
            'X-Pagination-Page-Count': industries['page_count'],
            'X-Pagination-Current-Page': industries['page_number']
        })


@api_view(['GET'])
@never_cache
def get_place_associations(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    union_entity = entities.Union()
    union_entity.page_number = request.query_params.get('page_number', 1)
    union_entity.count = request.query_params.get('count', 22)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        industries = union_use_case.get_place_associations(union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(
        presenter.to_list_response(industries['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
        headers={
            'X-Pagination-Count': industries['count'],
            'X-Pagination-Total-Count': industries['total_count'],
            'X-Pagination-Page-Count': industries['page_count'],
            'X-Pagination-Current-Page': industries['page_number']
        })


@api_view(['GET'])
@never_cache
def get_union_associations(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    union_entity = entities.Union()
    union_entity.page_number = request.query_params.get('page_number', 1)
    union_entity.count = request.query_params.get('count', 22)
    union_entity.search = request.query_params.get('search', None)

    if union_entity.search is not None and len(union_entity.search) < 3:
        return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        industries = union_use_case.get_union_associations(union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(
        presenter.to_list_response(industries['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
        headers={
            'X-Pagination-Count': industries['count'],
            'X-Pagination-Total-Count': industries['total_count'],
            'X-Pagination-Page-Count': industries['page_count'],
            'X-Pagination-Current-Page': industries['page_number']
        })


@api_view(['GET'])
@never_cache
def get_industries(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    union_entity = entities.Union()
    union_entity.page_number = request.query_params.get('page_number', 1)
    union_entity.count = request.query_params.get('count', 22)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        industries = union_use_case.get_industries(union_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(
        presenter.to_list_response(industries['unions_list'], max_depth=max_depth, needed_fields=needed_fields),
        headers={
            'X-Pagination-Count': industries['count'],
            'X-Pagination-Total-Count': industries['total_count'],
            'X-Pagination-Page-Count': industries['page_count'],
            'X-Pagination-Current-Page': industries['page_number']
        })


@permission_classes((AllowAny,))
class UnionApplicationViewSet(APIViewSet):
    status = openapi.Parameter('status', openapi.IN_QUERY, description='Фильтрация по статусу заявки',
                               type=openapi.TYPE_STRING)

    @swagger_auto_schema(operation_description='Получение списка заявок на вступление в просоюз или создание профсоюза',
                         manual_parameters=[status])
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'status'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        application_entity = entities.UnionApplication()
        application_entity.page_number = request.query_params.get('page_number', 1)
        application_entity.count = request.query_params.get('count', 10)
        application_entity.search = request.query_params.get('search', None)

        if application_entity.search is not None and len(application_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            union_applications = union_use_case.get_union_applications(application_entity,
                                                                       int(request.query_params['status']))
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(union_applications['unions_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': union_applications['count'],
                'X-Pagination-Total-Count': union_applications['total_count'],
                'X-Pagination-Page-Count': union_applications['page_count'],
                'X-Pagination-Current-Page': union_applications['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр заявки')
    def retrieve(self, request, pk=None):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            union_application = union_use_case.get_application_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(union_application,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))


@api_view(['POST'])
@never_cache
def confirm_union_application(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'application_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        union_use_case.confirm_application(request.data['application_id'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200)


@api_view(['POST'])
@never_cache
def reject_union_application(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'application_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        union_use_case.reject_application(request.data['application_id'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 200)


@api_view(['PATCH'])
@never_cache
def delete_union_application(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'application_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        union_use_case.delete_application(request.data['application_id'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 204)


class NewsViewSet(APIViewSet):
    permission_classes = (permissions.ActionAccessPermission,)

    title = openapi.Parameter('title', openapi.IN_QUERY, description='Фильтрация по заголовку',
                              type=openapi.TYPE_STRING)
    person = openapi.Parameter('person', openapi.IN_QUERY, description='Фильтрация по автору',
                               type=openapi.TYPE_INTEGER)
    source = openapi.Parameter('source', openapi.IN_QUERY, description='Фильтрация по источнику',
                               type=openapi.TYPE_STRING)
    union_id = openapi.Parameter('union_id', openapi.IN_QUERY, description='Фильтрация по профсоюзу',
                                 type=openapi.TYPE_STRING)

    @swagger_auto_schema(operation_description='Получение списка новостей',
                         manual_parameters=[title, person, source, union_id])
    def list(self, request):
        needed_fields = [
            'resource_id',
            'title',
            'person',
            'content',
            'picture_uri',
            'source',
            'is_published',
            'created_date',
            'updated_date'
        ]

        filters = ['title', 'person', 'source', 'union_id']

        news_entity = entities.News()
        news_entity.page_number = request.query_params.get('page_number', 1)
        news_entity.count = request.query_params.get('count', 10)
        news_entity.order_by = request.query_params.get('order_by', '-created_date')
        news_entity.is_public = bool(int(request.query_params.get('is_public', True)))
        news_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        news_entity.search = request.query_params.get('search', None)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            news_port = ports.NewsInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            news_port = ports.NewsInputPort(context=context)

        self.set_person(request, news_port)

        news_use_case = use_cases.NewsUseCase(news_port)

        try:
            self_news = bool(int(request.query_params.get('self', False)))

            if self_news:
                news = news_use_case.get_list(news_entity, author_id=request.auth.user.person.id)
            else:
                news = news_use_case.get_list(news_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(news['news_list'], max_depth=self.max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': news['count'],
                'X-Pagination-Total-Count': news['total_count'],
                'X-Pagination-Page-Count': news['page_count'],
                'X-Pagination-Current-Page': news['page_number']
            })

    @swagger_auto_schema(operation_description='Получение одной новости')
    def retrieve(self, request, pk=None):
        needed_fields = [
            'resource_id',
            'title',
            'person',
            'content',
            'picture_uri',
            'source',
            'is_published',
            'created_date',
            'updated_date'
        ]

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            news_port = ports.NewsInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            news_port = ports.NewsInputPort(context=context)

        self.set_person(request, news_port)

        news_use_case = use_cases.NewsUseCase(news_port)

        try:
            if request.user.is_authenticated:
                news = news_use_case.get_by_id(pk, author_id=request.auth.user.person.id)
            else:
                news = news_use_case.get_by_id(pk, None)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(news,
                                                   max_depth=self.max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание новости')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'localizations',
            'is_published',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        for localization in request.data['localizations']:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
                'title',
                'content',
                'source',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        news_entity = entities.News()
        news_entity.localizations = request.data['localizations']
        news_entity.is_published = bool(int(request.data['is_published']))
        news_entity.person.resource_id = request.auth.user.person.id

        allowed_fields = ['picture_id']

        for request_field in request.data:
            if request_field in allowed_fields:
                setattr(news_entity, request_field, request.data[request_field])

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            news_port = ports.NewsInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            news_port = ports.NewsInputPort(context=context)

        self.set_person(request, news_port)

        news_use_case = use_cases.NewsUseCase(news_port)

        try:
            news_id = news_use_case.create(news_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': news_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Редактирование новости')
    def partial_update(self, request, pk=None):
        news_entity = entities.News()

        allowed_fields = {
            'picture_id': ('int',),
            'is_published': ('int', 'bool')
        }

        news_entity.localizations = request.data.get('localizations', [])

        for localization in news_entity.localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(news_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            news_port = ports.NewsInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            news_port = ports.NewsInputPort(context=context)

        self.set_person(request, news_port)

        news_use_case = use_cases.NewsUseCase(news_port)

        try:
            news_use_case.edit(pk, news_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление новости')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        news_port = ports.NewsInputPort(context=context)
        self.set_person(request, news_port)
        news_use_case = use_cases.NewsUseCase(news_port)

        try:
            news_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class AppealViewSet(APIViewSet):
    category_id = openapi.Parameter('category_id', openapi.IN_QUERY, description='Фильтрация по категории',
                                    type=openapi.TYPE_INTEGER)
    status = openapi.Parameter('status', openapi.IN_QUERY, description='Фильтрация по статусу',
                               type=openapi.TYPE_INTEGER)
    resolved = openapi.Parameter('resolved', openapi.IN_QUERY, description='Фильтрация по статусу решения (решено ли)',
                                 type=openapi.TYPE_INTEGER)
    type = openapi.Parameter('type', openapi.IN_QUERY, description='Фильтрация по типу',
                             type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение списка обращений',
                         manual_parameters=[category_id, status, resolved, type])
    def list(self, request):
        needed_fields = [
            'resource_id',
            'person',
            'title',
            'content',
            'answer',
            'files',
            'created_date',
            'updated_date',
            'status'
        ]

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['category_id', 'status', 'resolved', 'type', 'union_id']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            appeal_port = ports.AppealInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            appeal_port = ports.AppealInputPort(context=context)

        self.set_person(request, appeal_port)

        appeal_use_case = use_cases.AppealUseCase(appeal_port)

        appeal_entity = entities.Appeal()
        appeal_entity.page_number = request.query_params.get('page_number', 1)
        appeal_entity.count = request.query_params.get('count', 10)
        appeal_entity.order_by = request.query_params.get('order_by', '-created_date')
        appeal_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        self_appeals = bool(int(request.query_params.get('self', False)))

        try:
            appeals = appeal_use_case.get_list(appeal_entity, request.auth.user.person.id, self_appeals)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(appeals['appeal_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': appeals['count'],
                'X-Pagination-Total-Count': appeals['total_count'],
                'X-Pagination-Page-Count': appeals['page_count'],
                'X-Pagination-Current-Page': appeals['page_number']
            })

    @swagger_auto_schema(operation_description='Получение одного обращения')
    def retrieve(self, request, pk=None):
        needed_fields = [
            'resource_id',
            'person',
            'title',
            'content',
            'answer',
            'files',
            'created_date',
            'updated_date',
            'status'
        ]

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            appeal_port = ports.AppealInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            appeal_port = ports.AppealInputPort(context=context)

        self.set_person(request, appeal_port)

        appeal_use_case = use_cases.AppealUseCase(appeal_port)

        try:
            appeal = appeal_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(appeal,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание обращения')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'content'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        appeal_entity = entities.Appeal()
        appeal_entity.content = request.data['content']
        appeal_entity.person.resource_id = request.auth.user.person.id

        allowed_fields = ['title', 'question_id', 'type']

        for request_field in request.data:
            if request_field in allowed_fields:
                setattr(appeal_entity, request_field, request.data[request_field])

        files = []

        if 'files' in request.data:
            for file_id in request.data['files'].split(','):
                file = entities.File()
                file.resource_id = file_id

                files.append(file)

            appeal_entity.files = files

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            appeal_port = ports.AppealInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            appeal_port = ports.AppealInputPort(context=context)

        self.set_person(request, appeal_port)

        appeal_use_case = use_cases.AppealUseCase(appeal_port)

        try:
            if 'question_id' in request.data:
                appeal_id = appeal_use_case.answer(appeal_entity, request.data['question_id'])
            else:
                appeal_entity.union.resource_id = request.data.get('union_id', 1)
                appeal_id = appeal_use_case.create(appeal_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': appeal_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Удаление обращения')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            appeal_port = ports.AppealInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            appeal_port = ports.AppealInputPort(context=context)

        self.set_person(request, appeal_port)

        appeal_use_case = use_cases.AppealUseCase(appeal_port)

        try:
            appeal_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class ArticleViewSet(APIViewSet):
    permission_classes = (AllowAny,)
    key = openapi.Parameter('key', openapi.IN_QUERY, description='Фильтрация по ключу',
                            type=openapi.TYPE_STRING)
    union_id = openapi.Parameter('union_id', openapi.IN_QUERY, description='Фильтрация по профсоюзу',
                                 type=openapi.TYPE_INTEGER)
    type_id = openapi.Parameter('type_id', openapi.IN_QUERY, description='Фильтрация по типу',
                                type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение минитекстов',
                         manual_parameters=[key, union_id, type_id])
    def list(self, request):
        needed_fields = [
            'resource_id',
            'union',
            'key',
            'person',
            'title',
            'content',
            'files',
            'created_date',
            'updated_date'
        ]

        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'key'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['key', 'type_id', 'union_id']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            article_port = ports.ArticleInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            article_port = ports.ArticleInputPort(context=context)

        self.set_person(request, article_port)

        article_use_case = use_cases.ArticleUseCase(article_port)

        article_entity = entities.Article()
        article_entity.parent_articles = False
        article_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        if 'parent_articles' in request.query_params:
            article_entity.parent_articles = bool(int(request.query_params['parent_articles']))

        if 'self' in request.query_params:
            article_entity.self = bool(int(request.query_params['self']))
            article_entity.person.resource_id = request.auth.user.person.id

        try:
            article = article_use_case.get_by_union_id(article_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_list_response(article,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание минитекста')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'key',
            'localizations'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        localizations = request.data['localizations']

        for localization in localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
                'content'
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        article_entity = entities.Article()
        article_entity.localizations = localizations
        article_entity.key = request.data['key']
        article_entity.person.resource_id = request.auth.user.person.id
        article_entity.union.resource_id = request.data.get('union_id', None)

        allowed_fields = ['type_id']

        for request_field in request.data:
            if request_field in allowed_fields:
                setattr(article_entity, request_field, request.data[request_field])

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            article_port = ports.ArticleInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            article_port = ports.ArticleInputPort(context=context)

        self.set_person(request, article_port)

        article_use_case = use_cases.ArticleUseCase(article_port)

        try:
            article_id = article_use_case.create(article_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': article_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление минитекста')
    def partial_update(self, request, pk=None):
        article_entity = entities.Article()
        article_entity.person.resource_id = request.auth.user.person.id

        localizations = request.data['localizations']

        for localization in localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        article_entity.localizations = localizations

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            article_port = ports.ArticleInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            article_port = ports.ArticleInputPort(context=context)

        self.set_person(request, article_port)

        article_use_case = use_cases.ArticleUseCase(article_port)

        try:
            article_use_case.edit(pk, article_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)


class LegislationViewSet(APIViewSet):
    permission_classes = (AllowAny,)
    parent_id = openapi.Parameter('parent_id', openapi.IN_QUERY, description='Фильтрация по разделу',
                                  type=openapi.TYPE_STRING)

    @swagger_auto_schema(operation_description='Получение разделов или статей',
                         manual_parameters=[parent_id])
    def list(self, request):
        needed_fields = [
            'resource_id',
            'parent_id',
            'title',
            'content',
            'children',
            'bread_crumbs',
            'created_date',
            'updated_date'
        ]

        filters = ['parent_id']

        legislation_entity = entities.Legislation()
        legislation_entity.page_number = request.query_params.get('page_number', 1)
        legislation_entity.count = request.query_params.get('count', 10)
        legislation_entity.order_by = request.query_params.get('order_by', 'updated_date')
        legislation_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        legislation_entity.search = request.query_params.get('search', None)

        if legislation_entity.search is not None and len(legislation_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            legislation_port = ports.LegislationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            legislation_port = ports.LegislationInputPort(context=context)

        self.set_person(request, legislation_port)

        legislation_use_case = use_cases.LegislationUseCase(legislation_port)

        try:
            legislation_list = legislation_use_case.get_list(legislation_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        for legislation in legislation_list['legislation_list']:
            legislation.children = presenter.to_list_response(legislation.children)

        return Response(
            presenter.to_list_response(legislation_list['legislation_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': legislation_list['count'],
                'X-Pagination-Total-Count': legislation_list['total_count'],
                'X-Pagination-Page-Count': legislation_list['page_count'],
                'X-Pagination-Current-Page': legislation_list['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр статьи')
    def retrieve(self, request, pk=None):
        needed_fields = [
            'resource_id',
            'parent_id',
            'title',
            'content',
            'children',
            'bread_crumbs',
            'created_date',
            'updated_date'
        ]

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            legislation_port = ports.LegislationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            legislation_port = ports.LegislationInputPort(context=context)

        self.set_person(request, legislation_port)

        legislation_use_case = use_cases.LegislationUseCase(legislation_port)

        try:
            legislation = legislation_use_case.get_by_id(legislation_id=pk)

        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        legislation.children = presenter.to_list_response(legislation.children)

        return Response(presenter.to_dict_response(legislation,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание статьи')
    def create(self, request):
        legislation_entity = entities.Legislation()

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            legislation_port = ports.LegislationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            legislation_port = ports.LegislationInputPort(context=context)

        self.set_person(request, legislation_port)

        legislation_use_case = use_cases.LegislationUseCase(legislation_port)

        legislation_entity.parent_id = None

        localizations = request.data['localizations']

        for localization in localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        legislation_entity.localizations = localizations

        allowed_fields = ['parent_id']

        for request_field in request.data:
            if request_field in allowed_fields:
                setattr(legislation_entity, request_field, request.data[request_field])

        try:
            legislation_id = legislation_use_case.create(legislation_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': legislation_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление статьи')
    def partial_update(self, request, pk=None):
        legislation_entity = entities.Legislation()

        localizations = request.data['localizations']

        for localization in localizations:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        legislation_entity.localizations = localizations

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            legislation_port = ports.LegislationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            legislation_port = ports.LegislationInputPort(context=context)

        self.set_person(request, legislation_port)

        legislation_use_case = use_cases.LegislationUseCase(legislation_port)

        try:
            legislation_use_case.edit(pk, legislation_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление статьи')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            legislation_port = ports.LegislationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            legislation_port = ports.LegislationInputPort(context=context)

        self.set_person(request, legislation_port)

        legislation_use_case = use_cases.LegislationUseCase(legislation_port)

        try:
            legislation_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


@api_view(['POST'])
@permission_classes((AllowAny,))
@never_cache
def upload_file(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'file'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    file_entity = entities.File()
    file_entity.name = request.FILES['file'].name
    file_entity.size = request.FILES['file'].size
    file_entity.content_type = request.FILES['file'].content_type
    file_entity.content = request.FILES['file'].read()
    file_entity.thumbnail = request.data.get('thumbnail', False)

    if file_entity.thumbnail:
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'width',
            'height'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        width = int(request.data['width'])
        height = int(request.data['height'])

        file_entity.content = PictureManager.create_thumbnail(file_entity.content, (width, height))
        file_entity.size = len(file_entity.content)

    if file_entity.size > 5 * 1024 * 1024:
        return Response({'message': 'Файл не должен быть больше 5 Мб'}, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        file_port = ports.FileInputPort(request.auth.user.role, request.auth.user.id, context)
        file_port.person_entity = entities.Person()
        file_port.person_entity.resource_id = request.auth.user.person.id
    else:
        file_port = ports.FileInputPort(context=context)

    file_use_case = use_cases.FileUseCase(file_port)

    try:
        file_id = file_use_case.upload(file_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, status=200, headers={
        'X-Entity-Id': file_id
    })


@api_view(['DELETE'])
@permission_classes((AllowAny,))
@never_cache
def delete_person_picture(request):
    person_entity = entities.Person()

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        user_use_case.delete_picture(person_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 204)


@api_view(['DELETE'])
@never_cache
def union_picture(request):
    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
    union_port.person_entity = entities.Person()
    union_port.person_entity.resource_id = request.auth.user.person.id
    union_use_case = use_cases.UnionUseCase(union_port)

    union_id = request.data.get('union_id', None)

    try:
        union_use_case.delete_picture(union_port.person_entity.resource_id, union_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 204)


@api_view(['DELETE'])
@permission_classes((AllowAny,))
@never_cache
def delete_file(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'record_id',
        'file_class_id'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    record_id = request.data['record_id']
    file_class_id = request.data['file_class_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        file_port = ports.FileInputPort(request.auth.user.role, request.auth.user.id, context)
        file_port.person_entity = entities.Person()
        file_port.person_entity.resource_id = request.auth.user.person.id
    else:
        file_port = ports.FileInputPort(context=context)

    file_use_case = use_cases.FileUseCase(file_port)

    try:
        file_use_case.delete(record_id, file_class_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 204)


@api_view(['DELETE'])
@permission_classes((AllowAny,))
@never_cache
def delete_file_link(request):
    validators.RequiredFieldsValidator.validate(request.data, [
        'link_id',
    ])

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        file_port = ports.FileInputPort(request.auth.user.role, request.auth.user.id, context)
        file_port.person_entity = entities.Person()
        file_port.person_entity.resource_id = request.auth.user.person.id
    else:
        file_port = ports.FileInputPort(context=context)

    file_use_case = use_cases.FileUseCase(file_port)

    try:
        file_use_case.delete_link_by_id(request.data['link_id'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 204)


@api_view(['GET'])
@never_cache
def get_profile(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        person_entity = user_use_case.get_person(request.auth.user.person.id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(presenter.to_dict_response(person_entity,
                                               max_depth=max_depth,
                                               needed_fields=needed_fields))


@api_view(['GET'])
@never_cache
def service_localization(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'key',
        'language'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        localization_port = ports.LocalizationInputPort(request.auth.user.role, request.auth.user.id, context)
        localization_port.person_entity = entities.Person()
        localization_port.person_entity.resource_id = request.auth.user.person.id
    else:
        localization_port = ports.LocalizationInputPort(context=context)

    localization_use_case = use_cases.LocalizationUseCase(localization_port)

    try:
        localization = localization_use_case.get(request.query_params['key'], request.query_params['language'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response({'localization': str(localization)}, 200)


@api_view(['GET'])
@never_cache
@permission_classes((AllowAny,))
def all_service_localization(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'language'
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        localization_port = ports.LocalizationInputPort(request.auth.user.role, request.auth.user.id, context)
        localization_port.person_entity = entities.Person()
        localization_port.person_entity.resource_id = request.auth.user.person.id
    else:
        localization_port = ports.LocalizationInputPort(context=context)

    localization_use_case = use_cases.LocalizationUseCase(localization_port)

    try:
        localization = localization_use_case.list(request.query_params['language'])
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(localization, 200)


@api_view(['PATCH'])
@never_cache
def edit_profile(request):
    allowed_fields = ['first_name', 'family_name', 'patronymic', 'job_position', 'birthday', 'sex', 'picture_id',
                      'email', 'physical_address', 'uid']

    person_entity = entities.Person()

    for request_field in request.data:
        if request_field in allowed_fields:
            if request_field == 'uid' and len(request.data[request_field]) != 12:
                raise Exception('ИИН должен быть равен 12 символам')

            setattr(person_entity, request_field, request.data[request_field])

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        user_port = ports.UserInputPort(request.auth.user.role, request.auth.user.id, context)
        user_port.person_entity = entities.Person()
        user_port.person_entity.resource_id = request.auth.user.person.id
    else:
        user_port = ports.UserInputPort(context=context)

    user_use_case = use_cases.UserUseCase(user_port)

    try:
        user_use_case.edit_person(request.data.get('person_id', request.auth.user.person.id), person_entity)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 202)


class DisputeViewSet(APIViewSet):
    category_id = openapi.Parameter('category_id', openapi.IN_QUERY, description='Фильтрация по категории',
                                    type=openapi.TYPE_INTEGER)
    status = openapi.Parameter('status', openapi.IN_QUERY, description='Фильтрация по статусу',
                               type=openapi.TYPE_INTEGER)
    resolved = openapi.Parameter('resolved', openapi.IN_QUERY, description='Фильтрация по статусу решено или нет',
                                 type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение списка трудовых споров',
                         manual_parameters=[category_id, status, resolved])
    def list(self, request):
        needed_fields = ['resource_id', 'title', 'thesis', 'solution', 'resolved', 'start_date', 'finish_date']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['category_id', 'status', 'resolved']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            dispute_port = ports.DisputeInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            dispute_port = ports.DisputeInputPort(context=context)

        self.set_person(request, dispute_port)

        dispute_use_case = use_cases.DisputeUseCase(dispute_port)

        dispute_entity = entities.Dispute()
        dispute_entity.page_number = request.query_params.get('page_number', 1)
        dispute_entity.count = request.query_params.get('count', 10)
        dispute_entity.order_by = request.query_params.get('order_by', '-id')
        dispute_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        dispute_entity.union_id = request.query_params.get('union_id', None)

        try:
            self_disputes = bool(int(request.query_params.get('self', False)))

            dispute = dispute_use_case.get_list(dispute_entity, request.auth.user.person.id, self_disputes)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(dispute['dispute_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': dispute['count'],
                'X-Pagination-Total-Count': dispute['total_count'],
                'X-Pagination-Page-Count': dispute['page_count'],
                'X-Pagination-Current-Page': dispute['page_number']
            })

    @swagger_auto_schema(operation_description='Получение трудового спора')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'title', 'thesis', 'solution', 'resolved', 'start_date', 'finish_date']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            dispute_port = ports.DisputeInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            dispute_port = ports.DisputeInputPort(context=context)

        self.set_person(request, dispute_port)

        dispute_use_case = use_cases.DisputeUseCase(dispute_port)

        try:
            dispute_entity = dispute_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(dispute_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание трудового спора')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'category_id',
            'localizations'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        for localization in request.data['localizations']:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
                'title',
                'thesis',
                'solution'
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        dispute_entity = entities.Dispute()
        dispute_entity.person.resource_id = request.auth.user.person.id
        dispute_entity.category_id = request.data['category_id']
        dispute_entity.localizations = request.data['localizations']

        allowed_fields = {
            'solution': ('str',),
            'resolved': ('int', 'bool')
        }

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(dispute_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            dispute_port = ports.DisputeInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            dispute_port = ports.DisputeInputPort(context=context)

        self.set_person(request, dispute_port)

        dispute_use_case = use_cases.DisputeUseCase(dispute_port)

        try:
            dispute_id = dispute_use_case.create(dispute_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': dispute_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление трудового спора')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'resolved': ('int', 'bool')
        }

        dispute_entity = entities.Dispute()

        if 'localizations' in request.data:
            for localization in request.data['localizations']:
                errors = validators.RequiredFieldsValidator.validate(localization, [
                    'language_id',
                    'title',
                    'thesis',
                ])

                if len(errors) > 0:
                    return Response(errors, 422)

            dispute_entity.localizations = request.data['localizations']

        dispute_entity.resource_id = pk

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(dispute_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            dispute_port = ports.DisputeInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            dispute_port = ports.DisputeInputPort(context=context)

        self.set_person(request, dispute_port)

        dispute_use_case = use_cases.DisputeUseCase(dispute_port)

        try:
            dispute_use_case.edit(dispute_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление трудового спора')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            dispute_port = ports.DisputeInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            dispute_port = ports.DisputeInputPort(context=context)

        self.set_person(request, dispute_port)

        dispute_use_case = use_cases.DisputeUseCase(dispute_port)

        try:
            dispute_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class PartnerViewSet(APIViewSet):
    permission_classes = (AllowAny,)
    category_id = openapi.Parameter('category_id', openapi.IN_QUERY, description='Фильтрация по категории',
                                    type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение списка партнеров',
                         manual_parameters=[category_id])
    def list(self, request):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['category_id']

        partner_entity = entities.Partner()
        partner_entity.page_number = request.query_params.get('page_number', 1)
        partner_entity.count = request.query_params.get('count', 10)
        partner_entity.order_by = request.query_params.get('order_by', '-created_date')
        partner_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        partner_entity.search = request.query_params.get('search', None)

        if partner_entity.search is not None and len(partner_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            partner_port = ports.PartnerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            partner_port = ports.PartnerInputPort(context=context)

        self.set_person(request, partner_port)

        partner_use_case = use_cases.PartnerUseCase(partner_port)

        try:
            partners = partner_use_case.get_list(partner_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(partners['partner_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': partners['count'],
                'X-Pagination-Total-Count': partners['total_count'],
                'X-Pagination-Page-Count': partners['page_count'],
                'X-Pagination-Current-Page': partners['page_number']
            })

    @swagger_auto_schema(operation_description='Получение партнера')
    def retrieve(self, request, pk=None):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            partner_port = ports.PartnerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            partner_port = ports.PartnerInputPort(context=context)

        self.set_person(request, partner_port)

        partner_use_case = use_cases.PartnerUseCase(partner_port)

        try:
            partner_entity = partner_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(partner_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание партнера')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'category_id',
            'picture_id',
            'localizations'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        for localization in request.data['localizations']:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
                'name',
                'description',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        allowed_fields = ['facebook', 'vk', 'twitter', 'odnoklassniki', 'instagram', 'whatsapp', 'telegram']

        partner_entity = entities.Partner()
        partner_entity.localizations = request.data['localizations']
        partner_entity.category_id = request.data['category_id']
        partner_entity.picture_id = request.data['picture_id']
        partner_entity.socials = {}

        for request_field in request.data:
            if request_field in allowed_fields:
                partner_entity.socials[request_field] = request.data[request_field]

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            partner_port = ports.PartnerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            partner_port = ports.PartnerInputPort(context=context)

        self.set_person(request, partner_port)

        partner_use_case = use_cases.PartnerUseCase(partner_port)

        try:
            partner_id = partner_use_case.create(partner_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': partner_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление партнера')
    def partial_update(self, request, pk=None):
        allowed_fields = ['picture_id']

        partner_entity = entities.Partner()
        partner_entity.resource_id = pk
        partner_entity.socials = {}

        if 'localizations' in request.data:
            for localization in request.data['localizations']:
                errors = validators.RequiredFieldsValidator.validate(localization, [
                    'language_id',
                    'name',
                    'description',
                ])

                if len(errors) > 0:
                    return Response(errors, 422)

            partner_entity.localizations = request.data['localizations']

        for request_field in request.data:
            if request_field in allowed_fields:
                setattr(partner_entity, request_field, request.data[request_field])

        allowed_socials = ['facebook', 'vk', 'twitter', 'odnoklassniki', 'instagram', 'whatsapp', 'telegram']

        for request_field in request.data:
            if request_field in allowed_socials:
                partner_entity.socials[request_field] = request.data[request_field]

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            partner_port = ports.PartnerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            partner_port = ports.PartnerInputPort(context=context)

        self.set_person(request, partner_port)

        partner_port = ports.PartnerInputPort(context=context)

        partner_use_case = use_cases.PartnerUseCase(partner_port)

        try:
            partner_use_case.edit(partner_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление партнера')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            partner_port = ports.PartnerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            partner_port = ports.PartnerInputPort(context=context)

        self.set_person(request, partner_port)

        partner_use_case = use_cases.PartnerUseCase(partner_port)

        try:
            partner_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class MemberViewSet(APIViewSet):
    union_id = openapi.Parameter('union_id', openapi.IN_QUERY, description='Фильтрация по профсоюзу',
                                 type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение списка членов профсоюза',
                         manual_parameters=[union_id])
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'union_id'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        person_entity = entities.Person()
        person_entity.page_number = request.query_params.get('page_number', 1)
        person_entity.count = request.query_params.get('count', 10)
        person_entity.order_by = request.query_params.get('order_by', '-created_date')
        person_entity.search = request.query_params.get('search', None)

        if person_entity.search is not None and len(person_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            members = union_use_case.get_member_list(person_entity, request.query_params['union_id'])
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(members['members_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': members['count'],
                'X-Pagination-Total-Count': members['total_count'],
                'X-Pagination-Page-Count': members['page_count'],
                'X-Pagination-Current-Page': members['page_number']
            })

    @swagger_auto_schema(operation_description='Получение члена профсоюза')
    def retrieve(self, request, pk=None):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        try:
            member = union_use_case.get_member_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(member,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Исключение члена профсоюза')
    def destroy(self, request, pk=None):
        if int(pk) == request.auth.user.person.id:
            return Response({'message': 'Вы не можете удалить самого себя'}, 422)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            union_port = ports.UnionInputPort(context=context)

        self.set_person(request, union_port)

        union_use_case = use_cases.UnionUseCase(union_port)

        reason = request.data['reason']

        try:
            union_use_case.delete_member(pk, reason)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class FAQViewSet(APIViewSet):
    @swagger_auto_schema(operation_description='Получение списка вопросов и ответов')
    def list(self, request):
        needed_fields = ['resource_id', 'question', 'answer']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = []

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            faq_port = ports.FAQInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            faq_port = ports.FAQInputPort(context=context)

        self.set_person(request, faq_port)

        faq_use_case = use_cases.FAQUseCase(faq_port)

        faq_entity = entities.FAQ()
        faq_entity.page_number = request.query_params.get('page_number', 1)
        faq_entity.count = request.query_params.get('count', 10)
        faq_entity.order_by = request.query_params.get('order_by', '-id')
        faq_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        try:
            faq_list = faq_use_case.get_list(faq_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(faq_list['faq_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': faq_list['count'],
                'X-Pagination-Total-Count': faq_list['total_count'],
                'X-Pagination-Page-Count': faq_list['page_count'],
                'X-Pagination-Current-Page': faq_list['page_number']
            })

    @swagger_auto_schema(operation_description='Получение вопроса и ответа на него')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'question', 'answer']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            faq_port = ports.FAQInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            faq_port = ports.FAQInputPort(context=context)

        self.set_person(request, faq_port)

        faq_use_case = use_cases.FAQUseCase(faq_port)

        try:
            faq_entity = faq_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(faq_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание вопроса и ответа')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'question',
            'answer',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        faq_entity = entities.FAQ()
        faq_entity.question = request.data['question']
        faq_entity.answer = request.data['answer']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            faq_port = ports.FAQInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            faq_port = ports.FAQInputPort(context=context)

        self.set_person(request, faq_port)

        faq_use_case = use_cases.FAQUseCase(faq_port)

        try:
            faq_id = faq_use_case.create(faq_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': faq_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление вопроса и ответа')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'question': ('str',),
            'answer': ('str',)
        }

        faq_entity = entities.FAQ()
        faq_entity.resource_id = pk

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(faq_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            faq_port = ports.FAQInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            faq_port = ports.FAQInputPort(context=context)

        self.set_person(request, faq_port)

        faq_use_case = use_cases.FAQUseCase(faq_port)

        try:
            faq_use_case.edit(faq_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление вопроса и ответа')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            faq_port = ports.FAQInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            faq_port = ports.FAQInputPort(context=context)

        self.set_person(request, faq_port)

        faq_use_case = use_cases.FAQUseCase(faq_port)

        try:
            faq_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class RecordViewSet(APIViewSet):
    permission_classes = (AllowAny,)
    book = openapi.Parameter('book', openapi.IN_QUERY, description='Фильтрация по справочнику',
                             type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение элементов справочника',
                         manual_parameters=[book])
    def list(self, request):
        needed_fields = ['resource_id', 'name', 'sort']

        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'book'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            record_port = ports.RecordInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            record_port = ports.RecordInputPort(context=context)

        self.set_person(request, record_port)

        record_use_case = use_cases.RecordUseCase(record_port)

        filters = []

        record_entity = entities.Record()
        record_entity.book = request.query_params['book']
        record_entity.page_number = request.query_params.get('page_number', 1)
        record_entity.count = request.query_params.get('count', 10)
        record_entity.order_by = request.query_params.get('order_by', '-id')
        record_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        try:
            record_list = record_use_case.get_list(record_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(record_list['record_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': record_list['count'],
                'X-Pagination-Total-Count': record_list['total_count'],
                'X-Pagination-Page-Count': record_list['page_count'],
                'X-Pagination-Current-Page': record_list['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр элемента справочника')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'name', 'sort']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            record_port = ports.RecordInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            record_port = ports.RecordInputPort(context=context)

        self.set_person(request, record_port)

        record_use_case = use_cases.RecordUseCase(record_port)

        try:
            record_entity = record_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(record_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание элемента справочника')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'book',
            'localizations'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        for localization in request.data['localizations']:
            errors = validators.RequiredFieldsValidator.validate(localization, [
                'language_id',
                'name',
            ])

            if len(errors) > 0:
                return Response(errors, 422)

        record_entity = entities.Record()
        record_entity.book = request.data['book']
        record_entity.localizations = request.data['localizations']
        record_entity.sort = request.data.get('sort', None)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            record_port = ports.RecordInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            record_port = ports.RecordInputPort(context=context)

        self.set_person(request, record_port)

        record_use_case = use_cases.RecordUseCase(record_port)

        try:
            record_id = record_use_case.create(record_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': record_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление элемента справочника')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'sort': ('int',)
        }

        record_entity = entities.Record()
        record_entity.resource_id = pk

        if 'localizations' in request.data:
            for localization in request.data['localizations']:
                errors = validators.RequiredFieldsValidator.validate(localization, [
                    'language_id',
                    'name',
                ])

                if len(errors) > 0:
                    return Response(errors, 422)

            record_entity.localizations = request.data['localizations']

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(record_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            record_port = ports.RecordInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            record_port = ports.RecordInputPort(context=context)

        self.set_person(request, record_port)

        record_use_case = use_cases.RecordUseCase(record_port)

        try:
            record_use_case.edit(record_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление элемента справочника')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            record_port = ports.RecordInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            record_port = ports.RecordInputPort(context=context)

        self.set_person(request, record_port)

        record_use_case = use_cases.RecordUseCase(record_port)

        try:
            record_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class OrderViewSet(APIViewSet):
    status = openapi.Parameter('status', openapi.IN_QUERY, description='Фильтрация по статусу',
                               type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение приказов',
                         manual_parameters=[status])
    def list(self, request):
        needed_fields = ['resource_id', 'title', 'union', 'person', 'files', 'created_date']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            order_port = ports.OrderInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            order_port = ports.OrderInputPort(context=context)

        self.set_person(request, order_port)

        order_use_case = use_cases.OrderUseCase(order_port)

        filters = ['status']

        order_entity = entities.Order()
        order_entity.union.resource_id = request.query_params.get('union_id', None)
        order_entity.parent_orders = False
        order_entity.all = False
        order_entity.page_number = request.query_params.get('page_number', 1)
        order_entity.count = request.query_params.get('count', 10)
        order_entity.order_by = request.query_params.get('order_by', '-id')
        order_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}
        order_entity.search = request.query_params.get('search', None)

        if order_entity.search is not None and len(order_entity.search) < 3:
            return Response({'message': 'Поисковая строка не может быть меньше 3-х символов'}, 422)

        if 'parent_orders' in request.query_params:
            order_entity.parent_orders = bool(int(request.query_params['parent_orders']))

        if 'all' in request.query_params:
            order_entity.all = bool(int(request.query_params['all']))

        try:
            order_list = order_use_case.get_list(order_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(order_list['order_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': order_list['count'],
                'X-Pagination-Total-Count': order_list['total_count'],
                'X-Pagination-Page-Count': order_list['page_count'],
                'X-Pagination-Current-Page': order_list['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр приказа')
    def retrieve(self, request, pk=None):
        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            order_port = ports.OrderInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            order_port = ports.OrderInputPort(context=context)

        self.set_person(request, order_port)

        order_use_case = use_cases.OrderUseCase(order_port)

        needed_fields = ['resource_id', 'title', 'union', 'person', 'files', 'created_date']

        try:
            order_entity = order_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(order_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание приказа')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'title',
            'files',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        order_entity = entities.Order()
        order_entity.title = request.data['title']
        order_entity.person.resource_id = request.auth.user.person.id

        files = []

        for file_id in request.data['files'].split(','):
            file = entities.File()
            file.resource_id = file_id

            files.append(file)

        order_entity.files = files

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            order_port = ports.OrderInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            order_port = ports.OrderInputPort(context=context)

        self.set_person(request, order_port)

        order_use_case = use_cases.OrderUseCase(order_port)

        try:
            order_id = order_use_case.create(order_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': order_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление приказа')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'title': ('str',),
        }

        order_entity = entities.Order()
        order_entity.resource_id = pk

        if 'files' in request.data:
            files = []

            for file_id in request.data['files'].split(','):
                file = entities.File()
                file.resource_id = file_id

                files.append(file)

            order_entity.files = files

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(order_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            order_port = ports.OrderInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            order_port = ports.OrderInputPort(context=context)

        self.set_person(request, order_port)

        order_use_case = use_cases.OrderUseCase(order_port)

        try:
            order_use_case.edit(order_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление приказа')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            order_port = ports.OrderInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            order_port = ports.OrderInputPort(context=context)

        self.set_person(request, order_port)

        order_use_case = use_cases.OrderUseCase(order_port)

        try:
            order_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class RevisionViewSet(APIViewSet):
    union_id = openapi.Parameter('union_id', openapi.IN_QUERY, description='Фильтрация по профсоюзу',
                                 type=openapi.TYPE_INTEGER)
    type_id = openapi.Parameter('type_id', openapi.IN_QUERY, description='Фильтрация по типу (тест или опрос)',
                                type=openapi.TYPE_INTEGER)
    status = openapi.Parameter('status', openapi.IN_QUERY, description='Фильтрация по статусу',
                               type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение тестов и опросов',
                         manual_parameters=[union_id, type_id, status])
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'union_id'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        needed_fields = ['resource_id', 'union', 'person', 'type', 'name', 'decree', 'percent_threshold', 'start_date',
                         'finish_date', 'status']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['union_id', 'type_id', 'status']

        revision_entity = entities.Revision()
        revision_entity.is_archive = False
        revision_entity.person.resource_id = request.auth.user.person.id
        revision_entity.page_number = request.query_params.get('page_number', 1)
        revision_entity.count = request.query_params.get('count', 10)
        revision_entity.order_by = request.query_params.get('order_by', '-id')
        revision_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        if 'is_archive' in request.query_params:
            revision_entity.is_archive = bool(int(request.query_params['is_archive']))

        if 'is_answered' in request.query_params:
            revision_entity.is_answered = bool(int(request.query_params['is_answered']))

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            revision_port = ports.RevisionInputPort(context=context)

        self.set_person(request, revision_port)

        revision_use_case = use_cases.RevisionUseCase(revision_port)

        try:
            revision_list = revision_use_case.get_list(revision_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(revision_list['revision_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': revision_list['count'],
                'X-Pagination-Total-Count': revision_list['total_count'],
                'X-Pagination-Page-Count': revision_list['page_count'],
                'X-Pagination-Current-Page': revision_list['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр теста/опроса')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'union', 'person', 'type', 'name', 'decree', 'percent_threshold', 'start_date',
                         'finish_date', 'status']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            revision_port = ports.RevisionInputPort(context=context)

        self.set_person(request, revision_port)
        revision_use_case = use_cases.RevisionUseCase(revision_port)

        try:
            revision_entity = revision_use_case.get_by_id(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(revision_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание теста/опроса')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'name',
            'type_id',
            'start_date',
            'finish_date'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        revision_entity = entities.Revision()
        revision_entity.person.resource_id = request.auth.user.person.id
        revision_entity.type.resource_id = request.data['type_id']
        revision_entity.name = request.data['name']
        revision_entity.start_date = request.data['start_date']
        revision_entity.finish_date = request.data['finish_date']
        revision_entity.status = request.data.get('status', 0)

        if 'percent_threshold' in request.data:
            revision_entity.percent_threshold = request.data['percent_threshold']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            revision_port = ports.RevisionInputPort(context=context)

        self.set_person(request, revision_port)
        revision_use_case = use_cases.RevisionUseCase(revision_port)

        try:
            revision_id = revision_use_case.create(revision_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': revision_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление теста/опроса')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'name': ('str',),
            'decree': ('str',),
            'type_id': ('int',),
            'percent_threshold': ('int',),
            'status': ('int',),
            'start_date': ('str',),
            'finish_date': ('str',),
        }

        revision_entity = entities.Revision()
        revision_entity.resource_id = pk

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(revision_entity, request_field, field_value)

        if 'percent_threshold' in request.data:
            revision_entity.percent_threshold = request.data['percent_threshold']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            revision_port = ports.RevisionInputPort(context=context)

        self.set_person(request, revision_port)
        revision_use_case = use_cases.RevisionUseCase(revision_port)

        try:
            if hasattr(revision_entity, 'status') and revision_entity.status == 1:
                del revision_entity.status
                revision_use_case.edit(revision_entity)
                revision_use_case.publish(revision_entity.resource_id)

            else:
                revision_use_case.edit(revision_entity)

        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление теста/опроса')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        revision_port = ports.RevisionInputPort(context=context)
        self.set_person(request, revision_port)
        revision_use_case = use_cases.RevisionUseCase(revision_port)

        try:
            revision_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


@api_view(['POST'])
@never_cache
def finish(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'revision_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    person_id = request.auth.user.person.id
    revision_id = request.data['revision_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        revision_port.person_entity = entities.Person()
        revision_port.person_entity.resource_id = request.auth.user.person.id
    else:
        revision_port = ports.RevisionInputPort(context=context)

    revision_use_case = use_cases.RevisionUseCase(revision_port)

    try:
        revision_statistics = revision_use_case.finish(revision_id, person_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(revision_statistics)


@api_view(['GET'])
def revision_test_statistic(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'revision_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    revision_id = request.query_params['revision_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        revision_port.person_entity = entities.Person()
        revision_port.person_entity.resource_id = request.auth.user.person.id
    else:
        revision_port = ports.RevisionInputPort(context=context)

    revision_use_case = use_cases.RevisionUseCase(revision_port)

    try:
        revision_test_statistics = revision_use_case.revision_test_statistic(revision_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    needed_fields = ['resource_id', 'union', 'person', 'type', 'name', 'percent_threshold', 'start_date',
                     'finish_date', 'status']

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    presenter = presenters.Presenter()

    revision_test_statistics['revision'] = presenter.to_dict_response(revision_test_statistics['revision'],
                                                                      max_depth=max_depth, needed_fields=needed_fields)

    return Response(revision_test_statistics)


@api_view(['GET'])
@never_cache
def person_test_statistic(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'revision_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    revision_id = request.query_params['revision_id']
    person_id = request.auth.user.person.id

    if 'person_id' in request.query_params:
        person_id = request.query_params['person_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        revision_port.person_entity = entities.Person()
        revision_port.person_entity.resource_id = request.auth.user.person.id
    else:
        revision_port = ports.RevisionInputPort(context=context)

    revision_use_case = use_cases.RevisionUseCase(revision_port)

    try:
        person_test_statistics = revision_use_case.person_test_statistics(revision_id, person_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(person_test_statistics)


@api_view(['GET'])
@never_cache
def revision_vote_statistic(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'revision_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    revision_id = request.query_params['revision_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        revision_port.person_entity = entities.Person()
        revision_port.person_entity.resource_id = request.auth.user.person.id
    else:
        revision_port = ports.RevisionInputPort(context=context)

    revision_use_case = use_cases.RevisionUseCase(revision_port)

    try:
        revision_vote_statistics = revision_use_case.revision_vote_statistic(revision_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    answer_needed_fields = ['resource_id', 'answer', 'total_responded']

    for question in revision_vote_statistics.questions:
        question.answers = presenter.to_list_response(question.answers,
                                                      max_depth=max_depth,
                                                      needed_fields=answer_needed_fields)

    question_needed_fields = ['resource_id', 'question', 'answers', 'has_alternate_answer']

    revision_vote_statistics.questions = presenter.to_list_response(revision_vote_statistics.questions,
                                                                    max_depth=max_depth,
                                                                    needed_fields=question_needed_fields)

    revision_needed_fields = ['resource_id', 'union', 'person', 'type', 'name', 'questions', 'percent_threshold',
                              'total_union_members', 'total_finished', 'not_finished', 'start_date', 'finish_date',
                              'status']

    return Response(
        presenter.to_dict_response(revision_vote_statistics, max_depth=max_depth, needed_fields=revision_needed_fields))


@api_view(['GET'])
@never_cache
def revision_members(request):
    errors = validators.RequiredFieldsValidator.validate(request.query_params, [
        'revision_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    revision_id = request.query_params['revision_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        revision_port = ports.RevisionInputPort(request.auth.user.role, request.auth.user.id, context)
        revision_port.person_entity = entities.Person()
        revision_port.person_entity.resource_id = request.auth.user.person.id
    else:
        revision_port = ports.RevisionInputPort(context=context)

    revision_use_case = use_cases.RevisionUseCase(revision_port)

    try:
        revision_member_list = revision_use_case.revision_members(revision_id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(presenter.to_list_response(revision_member_list,
                                               max_depth=max_depth,
                                               needed_fields=needed_fields))


class QuestionViewSet(APIViewSet):
    revision_id = openapi.Parameter('revision_id', openapi.IN_QUERY, description='Фильтрация по ID теста или опроса',
                                    type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение вопросов для теста/опроса',
                         manual_parameters=[revision_id])
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'revision_id',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        needed_fields = ['resource_id', 'revision', 'question', 'has_alternate_answer']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            question_port = ports.QuestionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            question_port = ports.QuestionInputPort(context=context)
        self.set_person(request, question_port)
        question_use_case = use_cases.QuestionUseCase(question_port)

        question_entity = entities.Question()
        question_entity.revision.resource_id = request.query_params['revision_id']
        question_entity.page_number = request.query_params.get('page_number', 1)
        question_entity.count = request.query_params.get('count', 10)
        question_entity.order_by = request.query_params.get('order_by', 'id')

        try:
            question_list = question_use_case.get_list(question_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(question_list['question_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': question_list['count'],
                'X-Pagination-Total-Count': question_list['total_count'],
                'X-Pagination-Page-Count': question_list['page_count'],
                'X-Pagination-Current-Page': question_list['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр вопроса')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'revision', 'question', 'answers', 'decree']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            question_port = ports.QuestionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            question_port = ports.QuestionInputPort(context=context)
        self.set_person(request, question_port)
        question_use_case = use_cases.QuestionUseCase(question_port)

        try:
            question_entity = question_use_case.get_by_id(pk, request.auth.user.person.id)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        for answer in question_entity.answers:
            if hasattr(answer, 'person'):
                answer.person = presenter.to_dict_response(answer.person)

        question_entity.answers = presenter.to_list_response(question_entity.answers)

        return Response(presenter.to_dict_response(question_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание вопроса')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'question',
            'revision_id',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        question_entity = entities.Question()
        question_entity.revision.resource_id = request.data['revision_id']
        question_entity.question = request.data['question']
        question_entity.has_alternate_answer = bool(int(request.data.get('has_alternate_answer', 0)))

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            question_port = ports.QuestionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            question_port = ports.QuestionInputPort(context=context)
        self.set_person(request, question_port)
        question_use_case = use_cases.QuestionUseCase(question_port)

        try:
            question_id = question_use_case.create(question_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': question_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление вопроса')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'question': ('str',),
            'has_alternate_answer': ('int', 'bool',),
        }

        question_entity = entities.Question()
        question_entity.resource_id = pk

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(question_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            question_port = ports.QuestionInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            question_port = ports.QuestionInputPort(context=context)
        self.set_person(request, question_port)
        question_use_case = use_cases.QuestionUseCase(question_port)

        try:
            question_use_case.edit(question_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление вопроса')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        question_port = ports.QuestionInputPort(context=context)
        self.set_person(request, question_port)
        question_use_case = use_cases.QuestionUseCase(question_port)

        try:
            question_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class CommentViewSet(APIViewSet):
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'question_id',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        needed_fields = ['resource_id', 'author', 'comment']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            comment_port = ports.CommentInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            comment_port = ports.CommentInputPort(context=context)

        self.set_person(request, comment_port)
        comment_use_case = use_cases.CommentUseCase(comment_port)

        comment_entity = entities.Comment()
        comment_entity.question.resource_id = request.query_params['question_id']
        comment_entity.page_number = request.query_params.get('page_number', 1)
        comment_entity.count = request.query_params.get('count', 10)
        comment_entity.order_by = request.query_params.get('order_by', 'id')

        try:
            comment_list = comment_use_case.get_list(comment_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(comment_list['comment_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': comment_list['count'],
                'X-Pagination-Total-Count': comment_list['total_count'],
                'X-Pagination-Page-Count': comment_list['page_count'],
                'X-Pagination-Current-Page': comment_list['page_number']
            })

    @never_cache
    @swagger_auto_schema(operation_description='Создание вопроса')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'question_id',
            'comment',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        comment_entity = entities.Comment()
        comment_entity.author.resource_id = request.auth.user.person.id
        comment_entity.question.resource_id = request.data['question_id']
        comment_entity.comment = request.data['comment']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            comment_port = ports.CommentInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            comment_port = ports.CommentInputPort(context=context)
        self.set_person(request, comment_port)
        comment_use_case = use_cases.CommentUseCase(comment_port)

        try:
            comment_id = comment_use_case.create(comment_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': comment_id
        })


class AnswerViewSet(APIViewSet):
    question_id = openapi.Parameter('question_id', openapi.IN_QUERY, description='Фильтрация по ID вопроса',
                                    type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение возможных ответов на вопрос',
                         manual_parameters=[question_id])
    def list(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.query_params, [
            'question_id',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        needed_fields = ['resource_id', 'answer', 'is_right', 'is_person_answer', 'total_responded', ]

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            answer_port = ports.AnswerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            answer_port = ports.AnswerInputPort(context=context)

        self.set_person(request, answer_port)
        answer_use_case = use_cases.AnswerUseCase(answer_port)

        answer_entity = entities.Answer()
        answer_entity.question.resource_id = request.query_params['question_id']
        answer_entity.page_number = request.query_params.get('page_number', 1)
        answer_entity.count = request.query_params.get('count', 10)
        answer_entity.order_by = request.query_params.get('order_by', '-id')

        try:
            answer_list = answer_use_case.get_list(answer_entity, request.query_params.get('person_id', None))
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(answer_list['answer_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': answer_list['count'],
                'X-Pagination-Total-Count': answer_list['total_count'],
                'X-Pagination-Page-Count': answer_list['page_count'],
                'X-Pagination-Current-Page': answer_list['page_number']
            })

    @never_cache
    @swagger_auto_schema(operation_description='Создание ответа на вопрос')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'question_id',
            'answer',
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        answer_entity = entities.Answer()
        answer_entity.person.resource_id = request.auth.user.person.id
        answer_entity.question.resource_id = request.data['question_id']
        answer_entity.answer = request.data['answer']
        answer_entity.is_right = bool(int(request.data.get('is_right', False)))

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            answer_port = ports.AnswerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            answer_port = ports.AnswerInputPort(context=context)

        self.set_person(request, answer_port)
        answer_use_case = use_cases.AnswerUseCase(answer_port)

        try:
            answer_id = answer_use_case.create(answer_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': answer_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление ответа на вопрос')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'answer': ('str',),
            'is_right': ('int', 'bool',),
        }

        answer_entity = entities.Answer()

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(answer_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            answer_port = ports.AnswerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            answer_port = ports.AnswerInputPort(context=context)
        self.set_person(request, answer_port)
        answer_use_case = use_cases.AnswerUseCase(answer_port)

        try:
            answer_use_case.edit(pk, answer_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление ответа на вопрос')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            answer_port = ports.AnswerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            answer_port = ports.AnswerInputPort(context=context)
        self.set_person(request, answer_port)
        answer_use_case = use_cases.AnswerUseCase(answer_port)

        try:
            answer_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class PersonAnswerViewSet(APIViewSet):
    @never_cache
    @swagger_auto_schema(operation_description='Ответ на вопрос')
    def create(self, request):
        if 'alternate_answer' in request.data:
            validate_fields = [
                'question_id'
            ]

        else:
            validate_fields = [
                'answer_id'
            ]

        errors = validators.RequiredFieldsValidator.validate(request.data, validate_fields)

        if len(errors) > 0:
            return Response(errors, 422)

        person_answer_entity = entities.PersonAnswer()
        person_answer_entity.person.resource_id = request.auth.user.person.id

        if 'alternate_answer' in request.data:
            person_answer_entity.alternate_answer = request.data['alternate_answer']
            person_answer_entity.question.resource_id = request.data['question_id']

        else:
            person_answer_entity.answer.resource_id = request.data['answer_id']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            person_answer_port = ports.PersonAnswerInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            person_answer_port = ports.PersonAnswerInputPort(context=context)

        self.set_person(request, person_answer_port)
        person_answer_use_case = use_cases.PersonAnswerUseCase(person_answer_port)

        try:
            person_answer_id = person_answer_use_case.create(person_answer_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': person_answer_id
        })


@api_view(['GET'])
def get_self_union(request):
    needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

    max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        union_port = ports.UnionInputPort(request.auth.user.role, request.auth.user.id, context)
        union_port.person_entity = entities.Person()
        union_port.person_entity.resource_id = request.auth.user.person.id
    else:
        union_port = ports.UnionInputPort(context=context)

    union_use_case = use_cases.UnionUseCase(union_port)

    try:
        union_id = union_use_case.get_by_person_id(request.auth.user.person.id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    presenter = presenters.Presenter()

    return Response(presenter.to_dict_response(union_id,
                                               max_depth=max_depth,
                                               needed_fields=needed_fields))


@permission_classes((AllowAny,))
class PermissionViewSet(APIViewSet):
    @never_cache
    @swagger_auto_schema(operation_description='Получение прав пользователя')
    def list(self, request):
        needed_fields = ['use_case', 'method', 'is_allowed']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            base_port = ports.InputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            base_port = ports.InputPort('guest', None)

        self.set_person(request, base_port)
        permission_use_case = use_cases.PermissionUseCase(base_port)

        try:
            permission_list = permission_use_case.get_list()
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_list_response(permission_list, max_depth=max_depth, needed_fields=needed_fields))


class NotificationViewSet(APIViewSet):
    @swagger_auto_schema(operation_description='Получение уведомлений для пользователя')
    def list(self, request):
        needed_fields = request.query_params['include'].split(',') if 'include' in request.query_params else None

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            notification_port = ports.NotificationInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            notification_port = ports.NotificationInputPort(context=context)
        self.set_person(request, notification_port)
        notification_use_case = use_cases.NotificationUseCase(notification_port)

        filters = []

        notification_entity = entities.Partner()
        notification_entity.page_number = request.query_params.get('page_number', 1)
        notification_entity.count = request.query_params.get('count', 10)
        notification_entity.order_by = request.query_params.get('order_by', '-created_date')
        notification_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        try:
            notification_list = notification_use_case.get_list(notification_entity, request.auth.user.person.id)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(notification_list['notification_list'], max_depth=max_depth,
                                       needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': notification_list['count'],
                'X-Pagination-Total-Count': notification_list['total_count'],
                'X-Pagination-Page-Count': notification_list['page_count'],
                'X-Pagination-Current-Page': notification_list['page_number']
            })


@api_view(['PATCH'])
@never_cache
def read_notification(request):
    errors = validators.RequiredFieldsValidator.validate(request.data, [
        'notification_id',
    ])

    if len(errors) > 0:
        return Response(errors, 422)

    notification_id = request.data['notification_id']

    context = {
        'language': request.headers.get('Accept-Language', 'ru')
    }

    if request.user.is_authenticated:
        notification_port = ports.NotificationInputPort(request.auth.user.role, request.auth.user.id, context)
        notification_port.person_entity = entities.Person()
        notification_port.person_entity.resource_id = request.auth.user.person.id
    else:
        notification_port = ports.NotificationInputPort(context=context)

    notification_use_case = use_cases.NotificationUseCase(notification_port)

    try:
        notification_use_case.read_notification(notification_id, request.auth.user.person.id)
    except Exception as error:
        return Response({'message': str(error)}, 422)

    return Response(None, 202)


class ChildrenViewSet(APIViewSet):
    person_id = openapi.Parameter('person_id', openapi.IN_QUERY, description='Фильтрация по персоне',
                                  type=openapi.TYPE_INTEGER)
    personal_code = openapi.Parameter('personal_code', openapi.IN_QUERY, description='Фильтрация по ИИН',
                                      type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(operation_description='Получение списка детей',
                         manual_parameters=[person_id, personal_code])
    def list(self, request):
        needed_fields = ['resource_id', 'family_name', 'first_name', 'patronymic', 'sex', 'personal_code', 'birth_date',
                         'age']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        filters = ['personal_code']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            children_port = ports.ChildrenInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            children_port = ports.ChildrenInputPort(context=context)

        child_entity = entities.Child()

        child_entity.person.resource_id = request.query_params.get('person_id', request.auth.user.person.id)

        children_use_case = use_cases.ChildrenUseCase(children_port)

        child_entity.page_number = request.query_params.get('page_number', 1)
        child_entity.count = request.query_params.get('count', 10)
        child_entity.order_by = request.query_params.get('order_by', '-id')
        child_entity.filter_by = {key: value for key, value in request.query_params.items() if key in filters}

        try:
            children = children_use_case.get_list(child_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(children['child_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': children['count'],
                'X-Pagination-Total-Count': children['total_count'],
                'X-Pagination-Page-Count': children['page_count'],
                'X-Pagination-Current-Page': children['page_number']
            })

    @swagger_auto_schema(operation_description='Просмотр одного ребенка')
    def retrieve(self, request, pk=None):
        needed_fields = ['resource_id', 'family_name', 'first_name', 'patronymic', 'sex', 'personal_code', 'birth_date',
                         'age']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        children_port = ports.ChildrenInputPort(context=context)
        self.set_person(request, children_port)
        children_use_case = use_cases.ChildrenUseCase(children_port)

        child_entity = entities.Child()
        child_entity.resource_id = pk

        try:
            children_entity = children_use_case.get_by_id(child_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(presenter.to_dict_response(children_entity,
                                                   max_depth=max_depth,
                                                   needed_fields=needed_fields))

    @never_cache
    @swagger_auto_schema(operation_description='Создание ребенка')
    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'family_name',
            'first_name',
            'sex',
            'personal_code',
            'birth_date'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        if len(request.data['personal_code']) != 12:
            return Response({'message': 'ИИН должен содержать 12 цифр'}, 422)

        child_entity = entities.Child()
        child_entity.person.resource_id = request.data.get('person_id', request.auth.user.person.id)
        child_entity.family_name = request.data['family_name']
        child_entity.first_name = request.data['first_name']
        child_entity.patronymic = request.data.get('patronymic', None)
        child_entity.sex = bool(int(request.data['sex']))
        child_entity.personal_code = request.data['personal_code']
        child_entity.birth_date = request.data['birth_date']

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        children_port = ports.ChildrenInputPort(context=context)
        self.set_person(request, children_port)
        children_use_case = use_cases.ChildrenUseCase(children_port)

        try:
            child_id = children_use_case.create(child_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': child_id
        })

    @never_cache
    @swagger_auto_schema(operation_description='Обновление ребенка')
    def partial_update(self, request, pk=None):
        allowed_fields = {
            'family_name': ('str',),
            'first_name': ('str',),
            'patronymic': ('str',),
            'sex': ('int', 'bool',),
            'personal_code': ('int',),
            'birth_date': ('str',),
        }

        child_entity = entities.Child()
        child_entity.resource_id = pk
        child_entity.person.resource_id = request.auth.user.person.id

        for request_field in request.data:
            if request_field in allowed_fields:
                field_value = request.data[request_field]

                if request_field == 'personal_code' and len(field_value) != 12:
                    return Response({'message': 'ИИН должен содержать 12 цифр'}, 422)

                for func_name in allowed_fields[request_field]:
                    field_value = getattr(builtins, func_name)(field_value)

                setattr(child_entity, request_field, field_value)

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        children_port = ports.ChildrenInputPort(context=context)
        self.set_person(request, children_port)
        children_use_case = use_cases.ChildrenUseCase(children_port)

        try:
            children_use_case.edit(child_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 202)

    @never_cache
    @swagger_auto_schema(operation_description='Удаление ребенка')
    def destroy(self, request, pk=None):
        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        children_port = ports.ChildrenInputPort(context=context)
        self.set_person(request, children_port)
        children_use_case = use_cases.ChildrenUseCase(children_port)

        try:
            children_use_case.delete(pk)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 204)


class ReportViewSet(APIViewSet):
    def list(self, request):

        needed_fields = ['resource_id', 'type', 'fields', 'union', 'name', 'date_created', 'file']

        max_depth = int(request.query_params['max_depth']) if 'max_depth' in request.query_params else 1

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            report_port = ports.ReportInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            report_port = ports.ReportInputPort(context=context)
        self.set_person(request, report_port)
        report_use_case = use_cases.ReportUseCase(report_port)

        report_entity = entities.Report()

        report_entity.union.resource_id = request.query_params.get('union_id', None)

        report_entity.page_number = request.query_params.get('page_number', 1)
        report_entity.count = request.query_params.get('count', 10)
        report_entity.order_by = request.query_params.get('order_by', '-id')

        try:
            report = report_use_case.get_list(report_entity, request.auth.user.person.id)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        presenter = presenters.Presenter()

        return Response(
            presenter.to_list_response(report['report_list'], max_depth=max_depth, needed_fields=needed_fields),
            headers={
                'X-Pagination-Count': report['count'],
                'X-Pagination-Total-Count': report['total_count'],
                'X-Pagination-Page-Count': report['page_count'],
                'X-Pagination-Current-Page': report['page_number']
            })

    def create(self, request):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'type_id',
            'fields'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        report_entity = entities.Report()

        report_entity.union.resource_id = request.data.get('union_id', None)
        report_entity.type.resource_id = request.data['type_id']
        report_entity.fields = request.data['fields'].split(',')

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            report_port = ports.ReportInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            report_port = ports.ReportInputPort(context=context)
        self.set_person(request, report_port)
        report_use_case = use_cases.ReportUseCase(report_port)

        try:
            report_id = report_use_case.create(report_entity, request.auth.user.person.id)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': report_id
        })

    def partial_update(self, request, pk=None):
        errors = validators.RequiredFieldsValidator.validate(request.data, [
            'fields'
        ])

        if len(errors) > 0:
            return Response(errors, 422)

        report_entity = entities.Report()
        report_entity.resource_id = pk
        report_entity.fields = request.data['fields'].split(',')

        context = {
            'language': request.headers.get('Accept-Language', 'ru')
        }

        if request.user.is_authenticated:
            report_port = ports.ReportInputPort(request.auth.user.role, request.auth.user.id, context)
        else:
            report_port = ports.ReportInputPort(context=context)
        self.set_person(request, report_port)
        report_use_case = use_cases.ReportUseCase(report_port)

        try:
            report_id = report_use_case.update(report_entity)
        except Exception as error:
            return Response({'message': str(error)}, 422)

        return Response(None, 201, headers={
            'X-Entity-Id': report_id
        })

# @api_view(['GET'])
# @permission_classes((AllowAny,))
# def get_file(request, filename):
#     base_port = ports.InputPort(context=context)
#
#     context = {
#             'language': request.headers.get('Accept-Language', 'ru')
#         }
#
#         if request.user.is_authenticated:
#         files_port = ports.FileInputPort(context=context)
#         base_port.person_entity = entities.Person()
#         base_port.person_entity.resource_id = request.auth.user.person.id
#     else:
#         files_port = ports.FileInputPort(context=context)
#
#     files_use_case = use_cases.FileUseCase(base_port, files_port)
#
#     file = files_use_case.get_by_hash(filename.split('.')[0])
#
#     response = HttpResponse()
#     response['Content-Type'] = file.content_type
#     response['X-Accel-Redirect'] = f'/static/{filename}'
#
#     return response
