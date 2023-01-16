import psycopg2
import psycopg2.extras
import time

import requests

from openpyexcel import load_workbook

base_url = 'http://127.0.0.1:8000/api/v1'


def run():
    workbook = load_workbook('formular.xlsx')

    connection = psycopg2.connect(
        dbname='smart_union_db',
        user='smart_union',
        password='rIARBIldeval',
        host='87.255.215.190',
        port='22233'
    )

    cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

    load_chairmen(workbook)
    #load_staff(workbook, cursor)

    cursor.close()
    connection.close()


def load_chairmen(workbook):
    chairmen = workbook['ППО И ПРЕДСЕДАТЕЛИ']

    with open('users.txt', 'a') as file:
        for row in list(chairmen.rows)[1:]:
            surname, first_name, patronymic, birthday, phone, email, branch = \
                (field.value for field in row)

            password = '123456'

            file.write(f'{phone} {password}\n')
            file.flush()

            response = requests.post(base_url + '/register', data={
                'phone': phone,
                'first_name': first_name,
                'family_name': surname,
                'patronymic': patronymic,
                'birthday': birthday,
                'sex': 1,
                'uid': '111111111111',
                'email': email,
                'password': password,
                'physical_address': 'Необходимо заполнить',
                'sms_code': 123456
            })

            response = requests.post(base_url + '/auth', data={
                'phone': phone,
                'password': password
            }, headers={'Content-Type': 'application/x-www-form-urlencoded'})

            token = response.json()['token']

            requests.post(base_url + '/create_union', data={
                'industry_id': 4,
                'association_id': 1,
                'union_name': branch,
                'union_protocol_id': 1,
                'union_position_id': 1,
                'union_statement_id': 1,
            }, headers={'Authorization': token, 'Content-Type': 'application/x-www-form-urlencoded'})


def load_staff(workbook, cursor):
    staff = workbook['ВСЕ ЧЛЕНЫ ППО ТТК']

    sex_dict = {'Мужской': 1, 'Женский': 0}

    with open('users.txt', 'a') as file:
        for index, row in enumerate(list(staff.rows)[1:]):
            surname, first_name, patronymic, uid, birthday, sex, phone, branch, email, join_date = \
                (field.value for field in row)

            cursor.execute(f'select record_id from localizations l \
                where l.attribute_class_id = 3 and key = \'name\' and value = \'{branch}\'')

            sex = sex_dict[sex]
            branch_id = cursor.fetchone()[0]

            phone = f'7{str(phone)[1:]}'

            password = '123456'

            file.write(f'{phone} {password}\n')
            file.flush()

            try:
                requests.post(base_url + '/register', data={
                    'phone': phone,
                    'first_name': first_name,
                    'family_name': surname,
                    'patronymic': patronymic,
                    'birthday': birthday,
                    'sex': sex,
                    'uid': uid,
                    'email': email,
                    'password': password,
                    'physical_address': 'Необходимо заполнить'
                })

            except ConnectionError:
                time.sleep(10)
                requests.post(base_url + '/register', data={
                    'phone': phone,
                    'first_name': first_name,
                    'family_name': surname,
                    'patronymic': patronymic,
                    'birthday': birthday,
                    'sex': sex,
                    'uid': uid,
                    'email': email,
                    'password': password,
                    'physical_address': 'Необходимо заполнить'
                })

            try:
                response = requests.post(base_url + '/auth', data={
                    'phone': phone,
                    'password': password
                })

            except ConnectionError:
                time.sleep(10)
                response = requests.post(base_url + '/auth', data={
                    'phone': phone,
                    'password': password
                })

            if 'token' in response.json():

                token = response.json()['token']

                try:
                    requests.post(base_url + '/join_union', data={
                        'union_id': branch_id,
                        'files': '3'
                    }, headers={'Authorization': token})

                except ConnectionError:
                    time.sleep(10)
                    requests.post(base_url + '/join_union', data={
                        'union_id': branch_id,
                        'files': '3'
                    }, headers={'Authorization': token})


if __name__ == '__main__':
    run()
