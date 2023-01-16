import requests
import paramiko
import qrcode
import io

from django.core.exceptions import ObjectDoesNotExist

from django.conf import settings
from PIL import Image

from openpyexcel import Workbook

from union_app import models


class SMSManager:
    @staticmethod
    def send_sms(sms_id, phone, message):
        requests.get(
            f'https://service.sms-consult.kz/get.ashx?login=KasipOdaq&password=2gF7PDRo&id={sms_id}&type=message&recipient={phone}&sender=MESSAGE&text={message}')


class FTPManager:
    def __open_connection(self):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(settings.FILE_STORAGE_HOST,
                    username=settings.FILE_STORAGE_USER,
                    password=settings.FILE_STORAGE_PASSWORD,
                    port=settings.FILE_STORAGE_PORT)

        ftp = ssh.open_sftp()

        self.ssh = ssh
        self.ftp = ftp

    def __close_connection(self):
        self.ftp.close()
        self.ssh.close()

    def get_file_dir(self):
        pass

    def upload_file(self, path, filename, file_content):
        self.__open_connection()

        folders = path.split('/')

        for folder in folders:
            try:
                self.ftp.mkdir(folder)
            except OSError:
                pass

            self.ftp.chdir(folder)

        file = self.ftp.file(filename, 'w')
        file.write(file_content)
        file.flush()
        file.close()

        self.__close_connection()

    def remove_file(self, path, filename):
        self.__open_connection()

        try:
            self.ftp.remove(filename + '/' + filename)
        except OSError:
            pass


class PictureManager:
    @staticmethod
    def create_thumbnail(image_data, size):
        image = Image.open(io.BytesIO(image_data))
        image.thumbnail(size)

        output_stream = io.BytesIO()
        image.save(output_stream, image.format)

        return output_stream.getvalue()


class QRManager:
    @staticmethod
    def generate_image(data):
        return qrcode.make(data)

    @staticmethod
    def get_image_content(image):
        stream = io.BytesIO()
        image.save(stream, format='png')

        return stream.getvalue()


class EmailManager:
    def __init__(self):
        pass


class ReportManager:
    @staticmethod
    def generate_report(report_entity, language_code='ru'):
        wb = getattr(ReportManager, 'generate_' + report_entity.type.type + '_report')(report_entity, language_code)

        ws = wb.active
        dims = {}
        for row in ws.rows:
            for cell in row:
                if cell.value:
                    dims[cell.column] = max((dims.get(cell.column, 0), len(str(cell.value))))
        for col, value in dims.items():
            if value < 3:
                ws.column_dimensions[col].width = 5
            else:
                ws.column_dimensions[col].width = value * 1.5

        ws.title = report_entity.type.name

        return wb

    @staticmethod
    def generate_children_report(report_entity, language_code='ru'):
        full_fields = ['full_name', 'father', 'mother', 'personal_code', 'sex', 'birth_date']
        fields_keys = report_entity.fields.keys()

        localizations = {
            'ru': {
                'male': 'Мужской',
                'female': 'Женский'
            },
            'kk': {
                'male': 'Ер адам',
                'female': 'Әйел'
            }
        }

        fields_names = ['№']

        for field in full_fields:
            if field in fields_keys:
                fields_names.append(report_entity.fields[field])

        wb = Workbook()
        ws = wb.active
        ws.append(fields_names)

        person_ids = list(models.UnionMember.objects.filter(union_id=report_entity.union.resource_id,
                                                            status__in=[1, 101]).values_list('person_id', flat=True))

        children = models.Children.objects.filter(person_id__in=person_ids).distinct('personal_code')

        count = 1

        for child in children:
            new_record = [count]

            if 'full_name' in fields_keys:
                personal = child.family_name + ' ' + child.first_name

                if child.patronymic is not None:
                    personal = personal + ' ' + child.patronymic

                new_record.append(personal)

            if 'parents' in fields_keys:
                all_children = models.Children.objects.filter(personal_code=child.personal_code)

                mother = None
                father = None

                for child_copy in all_children:
                    parent_sex = bool(int(models.PersonAttribute.objects.get(person_id=child_copy.person_id,
                                                                             property__uid='person_sex',
                                                                             property__book__book_class='person_attributes').value))

                    if parent_sex:
                        father = child_copy.person.family_name + ' ' + child_copy.person.first_name

                        if child_copy.person.patronymic is not None:
                            father = father + ' ' + child_copy.person.patronymic

                    else:
                        mother = child_copy.person.family_name + ' ' + child_copy.person.first_name

                        if child_copy.person.patronymic is not None:
                            mother = mother + ' ' + child_copy.person.patronymic

                new_record.append(father)
                new_record.append(mother)

            if 'personal_code' in fields_keys:
                new_record.append(str(child.personal_code))

            if 'sex' in fields_keys:
                sex = int(child.sex)
                if sex == 1:
                    sex = localizations[language_code]['male']
                elif sex == 0:
                    sex = localizations[language_code]['female']

                new_record.append(sex)

            if 'birth_date' in fields_keys:
                new_record.append(child.birth_date.strftime('%d.%m.%Y'))

            ws.append(new_record)
            count += 1

        return wb

    @staticmethod
    def generate_members_report(report_entity, language_code='ru'):
        full_fields = ['full_name', 'sex', 'birth_date', 'personal_code', 'join_date']
        fields_keys = report_entity.fields.keys()

        localizations = {
            'ru': {
                'total_count': 'Общее колличество',
                'male': 'Мужской',
                'female': 'Женский'
            },
            'kk': {
                'total_count': 'Жалпы саны',
                'male': 'Ер адам',
                'female': 'Әйел'
            }
        }

        fields_names = ['№']

        for field in full_fields:
            if field in fields_keys:
                fields_names.append(report_entity.fields[field])

        wb = Workbook()
        ws = wb.active

        members = models.UnionMember.objects.filter(union_id=report_entity.union.resource_id, status__in=[1, 101])

        ws.append([None])
        ws.append([None, localizations[language_code]['total_count'], members.count()])
        ws.append([None])
        ws.append(fields_names)

        count = 1

        for member in members:
            new_record = [count]

            if 'full_name' in fields_keys:
                personal = member.person.family_name + ' ' + member.person.first_name

                if member.person.patronymic is not None:
                    personal = personal + ' ' + member.person.patronymic

                new_record.append(personal)

            if 'sex' in fields_keys:
                sex = int(
                    models.PersonAttribute.objects.get(person_id=member.person_id, property__uid='person_sex').value)
                if sex == 1:
                    sex = localizations[language_code]['male']
                elif sex == 0:
                    sex = localizations[language_code]['female']

                new_record.append(sex)

            if 'birth_date' in fields_keys:
                new_record.append(models.PersonAttribute.objects.get(person_id=member.person_id,
                                                                     property__uid='person_birthday').value)

            if 'personal_code' in fields_keys:
                new_record.append(str(member.person.individual_number))

            if 'join_date' in fields_keys:
                new_record.append(member.join_date.strftime('%d.%m.%Y'))

            ws.append(new_record)
            count += 1

        return wb

    @staticmethod
    def generate_members_count_report(report_entity, language_code='ru'):

        full_fields = ['union_name', 'members_count']
        fields_keys = report_entity.fields.keys()

        localizations = {
            'ru': {
                'union_name': 'Название профсоюза',
                'members_count': 'Общее колличество',
            },
            'kk': {
                'union_name': 'Кәсіподақтың атауы',
                'members_count': 'Жалпы саны',
            }
        }

        fields_names = ['№']

        for field in full_fields:
            if field in fields_keys:
                fields_names.append(report_entity.fields[field])

        wb = Workbook()
        ws = wb.active

        ws.append(['№', localizations[language_code]['union_name'], localizations[language_code]['members_count']])
        count = 1

        union = models.Union.objects.get(pk=report_entity.union.resource_id)

        second_language_code = 'ru' if language_code == 'kk' else 'ru'

        try:
            union_name = models.Localization.objects.get(record_id=union.id,
                                                         language__code=language_code,
                                                         attribute_class__book__book_class='classes',
                                                         attribute_class__uid='union',
                                                         key='name').value
        except ObjectDoesNotExist:
            union_name = models.Localization.objects.get(record_id=union.id,
                                                         language__code=second_language_code,
                                                         attribute_class__book__book_class='classes',
                                                         attribute_class__uid='union',
                                                         key='name').value

        full_union_ids = [union.id]
        current_child_ids = list(models.Union.objects.filter(parent_id=union.id).values_list('id', flat=True))

        full_union_ids.extend(current_child_ids)

        while len(current_child_ids) > 0:
            current_child_ids = list(
                models.Union.objects.filter(parent_id__in=current_child_ids,
                                            type__in=['main_union', 'industry', 'branch', 'union']).values_list(
                    'id', flat=True))
            full_union_ids.extend(current_child_ids)

        members_count = models.UnionMember.objects.filter(union_id__in=full_union_ids,
                                                          status__in=[1, 101]).count()

        ws.append([count, union_name, members_count])

        unions = models.Union.objects.filter(parent_id=union.id,
                                             type__in=['main_union', 'industry', 'branch', 'union'],
                                             status=1)

        for union in unions:
            count += 1

            try:
                union_name = models.Localization.objects.get(record_id=union.id,
                                                             language__code=language_code,
                                                             attribute_class__book__book_class='classes',
                                                             attribute_class__uid='union',
                                                             key='name').value
            except ObjectDoesNotExist:
                union_name = models.Localization.objects.get(record_id=union.id,
                                                             language__code=second_language_code,
                                                             attribute_class__book__book_class='classes',
                                                             attribute_class__uid='union',
                                                             key='name').value

            full_union_ids = [union.id]
            current_child_ids = list(models.Union.objects.filter(parent_id=union.id).values_list('id', flat=True))

            full_union_ids.extend(current_child_ids)

            while len(current_child_ids) > 0:
                current_child_ids = list(
                    models.Union.objects.filter(parent_id__in=current_child_ids,
                                                type__in=['main_union', 'industry', 'branch', 'union']).values_list(
                        'id', flat=True))
                full_union_ids.extend(current_child_ids)

            members_count = models.UnionMember.objects.filter(union_id__in=full_union_ids,
                                                              status__in=[1, 101]).count()

            ws.append([count, union_name, members_count])

        return wb


class PermissionManager:
    def equals(self, variable, value):
        return variable == value

    def contains(self, variable_list, value):
        return value in variable_list

    def has_permission(self, conditions):
        has_permission = True

        for condition in conditions:
            pass

        return has_permission
