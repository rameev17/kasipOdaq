from . import entities

from .permissions import Permission, set_permissions


class BaseUseCase:
    def __init__(self, base_port):
        self.permission = Permission()
        self.rules_gateway = base_port.rules_gateway

        try:
            person_entity = base_port.person_gateway.get_by_id(getattr(base_port.person_entity, 'resource_id', None))
            person_entity.is_auth = True
        except:
            person_entity = entities.Person()
            person_entity.is_auth = False
            person_entity.roles = []

        try:
            base_port.union_gateway.get_member_by_id(base_port.person_gateway,
                                                     getattr(base_port.person_entity, 'resource_id', None))

            person_entity.is_union_member = True
        except:
            person_entity.is_union_member = False

        self.person_entity = person_entity


class UserUseCase(BaseUseCase):
    class_uid = 'user'

    def __init__(self, user_port):
        super().__init__(user_port)

        self.person_gateway = user_port.person_gateway
        self.user_gateway = user_port.user_gateway
        self.sms_gateway = user_port.sms_gateway
        self.union_gateway = user_port.union_gateway
        self.article_gateway = user_port.article_gateway
        self.file_gateway = user_port.file_gateway

    def authorize(self, user_entity):
        auth_user = self.user_gateway.get(user_entity)
        auth_user.person = self.person_gateway.get_by_id(auth_user.person.resource_id)

        return auth_user

    def restore_password(self, sms_code, user_entity):
        if not self.sms_gateway.has_confirmed(user_entity.phone, sms_code):
            raise Exception('Номер телефона не подтвержден')

        self.user_gateway.restore_password(user_entity)

    def change_password(self, user_entity):
        user_entity.person = self.person_entity

        self.user_gateway.change_password(user_entity)

    def get_person(self, person_id):
        person_entity = self.person_gateway.get_by_id(person_id)
        person_entity.union = self.union_gateway.get_by_member_id(person_entity.resource_id,
                                                                  self.person_gateway,
                                                                  self.article_gateway)

        return person_entity

    def edit_person(self, person_id, person_entity):
        self.person_gateway.edit(person_id, person_entity)

    def delete_picture(self, person_entity):
        self.person_gateway.delete_picture(person_entity)

    def register(self, sms_code, user_entity):
        if not self.sms_gateway.has_confirmed(user_entity.phone, sms_code):
            raise Exception('Номер телефона не подтвержден')

        if self.user_gateway.with_phone_exists(user_entity.phone):
            raise Exception('Пользователь с таким телефоном уже существует')

        if len(user_entity.person.individual_number) != 12:
            raise Exception('ИИН должен содержать 12 символов')

        person_id = self.person_gateway.create(user_entity.person, self.file_gateway)
        user_entity.person.resource_id = person_id

        user_id = self.user_gateway.create(user_entity)

        return user_id


class SettingsUseCase(BaseUseCase):
    class_uid = 'settings'

    def __init__(self, settings_port):
        super().__init__(settings_port)

        self.settings_gateway = settings_port.settings_gateway

    def get(self, person_id):
        return self.settings_gateway.get(person_id)

    def edit(self, faq_entity):
        self.settings_gateway.edit(faq_entity)


class UnionUseCase(BaseUseCase):
    class_uid = 'union'

    def __init__(self, union_port):
        super().__init__(union_port)

        self.union_gateway = union_port.union_gateway
        self.person_gateway = union_port.person_gateway
        self.user_gateway = union_port.user_gateway
        self.sms_gateway = union_port.sms_gateway
        self.file_gateway = union_port.file_gateway
        self.article_gateway = union_port.article_gateway
        self.children_gateway = union_port.children_gateway

    def create(self, person_entity, union_entity):
        if self.person_gateway.is_union_member(person_entity):
            raise Exception('Вы уже подали заявку')

        union_entity.creator = person_entity

        union_id = self.union_gateway.create(union_entity)
        union_entity.resource_id = union_id

        member_id = self.person_gateway.join_union(person_entity, union_entity)

        return member_id

    def join(self, person_entity, union_entity):
        if self.person_gateway.is_union_member(person_entity):
            raise Exception('Вы уже подали заявку')

        union_entity = self.union_gateway.get_by_id(union_entity.resource_id, self.person_gateway, self.article_gateway)

        member_id = self.person_gateway.join_union(person_entity, union_entity)

        return member_id

    def set_union_master(self, old_master_id, new_master_id):
        person_id = self.union_gateway.set_union_master(old_master_id, new_master_id)

        return person_id

    def create_union_member(self, user_entity, master_id, children):
        if self.union_gateway.is_union_master(master_id):
            if self.user_gateway.with_phone_exists(user_entity.phone):
                raise Exception('Пользователь с таким телефоном уже существует')

            if len(user_entity.person.individual_number) != 12:
                raise Exception('ИИН должен содержать 12 символов')

            sms_entity = entities.ShortMessage()
            sms_entity.phone = user_entity.phone
            sms_entity.method = 'create_union_member'

            sms_code = self.sms_gateway.create(sms_entity)

            user_entity.password = sms_code

            person_id = self.person_gateway.create(user_entity.person, self.file_gateway)
            user_entity.person.resource_id = person_id

            for child in children:
                child_entity = entities.Child()
                child_entity.person.resource_id = person_id
                child_entity.family_name = child['family_name']
                child_entity.first_name = child['first_name']
                child_entity.patronymic = child.get('patronymic', None)
                child_entity.sex = bool(int(child['sex']))
                child_entity.personal_code = child['personal_code']
                child_entity.birth_date = child['birth_date']

                self.children_gateway.create(child_entity)

            self.user_gateway.create(user_entity)

            application_id = self.union_gateway.create_union_member(person_id, master_id)

            self.union_gateway.confirm_application(application_id)

            return person_id

        else:
            raise Exception('Вы не являетесь председатель профсюза')

    def get_list(self, union_entity, parent_id=None):
        unions = self.union_gateway.get_list(parent_id, union_entity, self.person_gateway, self.article_gateway)

        return unions

    def unions_by_person(self, union_entity, person_id):
        return self.union_gateway.unions_by_person(union_entity, self.person_gateway, self.article_gateway, person_id)

    def get_industries(self, union_entity):
        return self.union_gateway.get_industries(union_entity, self.person_gateway, self.article_gateway)

    def get_union_associations(self, union_entity):
        return self.union_gateway.get_union_associations(union_entity, self.person_gateway, self.article_gateway)

    def get_place_associations(self, union_entity):
        return self.union_gateway.get_place_associations(union_entity, self.person_gateway, self.article_gateway)

    def get_union_applications(self, application_entity, status):
        return self.union_gateway.get_union_applications(self.person_entity, application_entity, self.person_gateway,
                                                         self.article_gateway, status)

    def get_application_by_id(self, application_id):
        return self.union_gateway.get_union_application(application_id, self.person_gateway, self.article_gateway)

    def confirm_application(self, application_id):
        self.union_gateway.confirm_application(application_id)

    def reject_application(self, application_id):
        self.union_gateway.reject_application(application_id)

    def delete_application(self, application_id):
        self.union_gateway.delete_application(application_id)

    def get_by_id(self, union_id):
        union_entity = self.union_gateway.get_by_id(union_id, self.person_gateway, self.article_gateway)

        return union_entity

    def get_by_person_id(self, person_id):
        return self.union_gateway.get_by_person_id(person_id, self.person_gateway, self.article_gateway)

    def get_member_list(self, person_entity, union_id):
        return self.union_gateway.get_member_list(self.person_gateway, person_entity, union_id)

    def get_member_by_id(self, member_id):
        return self.union_gateway.get_member_by_id(self.person_gateway, member_id)

    def edit(self, union_entity):
        self.union_gateway.edit(union_entity, self.person_gateway, self.article_gateway)

    def delete_member(self, person_id, reason):
        self.union_gateway.delete_member(person_id, reason)

    def delete_picture(self, person_id, union_id):
        self.union_gateway.delete_picture(person_id, union_id)

    def import_members(self, file_entity):
        self.union_gateway.import_members(file_entity)

    def import_children(self, file_entity):
        self.union_gateway.import_children(file_entity)


class ShortMessageUseCase(BaseUseCase):
    class_uid = 'short_message'

    def __init__(self, sms_port):
        super().__init__(sms_port)

        self.sms_gateway = sms_port.sms_gateway
        self.user_gateway = sms_port.user_gateway

    def send_sms(self, sms_entity, ip):
        if sms_entity.method == 'register' and self.user_gateway.with_phone_exists(sms_entity.phone):
            raise Exception('Пользователь с таким телефоном уже существует')

        sms_id = self.sms_gateway.create(sms_entity, ip)

        return sms_id

    def confirm_sms(self, phone, sms_code, ip):
        self.sms_gateway.confirm(phone, sms_code, ip)


class NewsUseCase(BaseUseCase):
    class_uid = 'news'

    def __init__(self, news_port):
        super().__init__(news_port)

        self.news_gateway = news_port.news_gateway
        self.person_gateway = news_port.person_gateway

    def create(self, news_entity):
        news_id = self.news_gateway.create(news_entity)

        if news_entity.is_published:
            self.news_gateway.publish_news(news_id)

        return news_id

    def edit(self, news_id, news_entity):
        self.news_gateway.edit(news_id, news_entity)

        if news_entity.is_published:
            self.news_gateway.publish_news(news_id)

    def get_list(self, news_entity, author_id=None):
        if news_entity.is_public:
            news_list = self.news_gateway.get_public_list(self.person_entity, self.person_gateway, news_entity,
                                                          author_id)
        else:
            news_list = self.news_gateway.get_list(self.person_entity, self.person_gateway, news_entity, author_id)

        return news_list

    def get_by_id(self, news_id, author_id=None):
        return self.news_gateway.get_by_id(news_id, self.person_gateway, author_id)

    def delete(self, news_id):
        self.news_gateway.delete(news_id)


class FileUseCase(BaseUseCase):
    class_uid = 'file'

    def __init__(self, file_port):
        super().__init__(file_port)

        self.file_gateway = file_port.file_gateway

    def upload(self, file_entity):
        return self.file_gateway.create(file_entity)

    def delete(self, record_id, file_class_id):
        return self.file_gateway.delete(record_id, file_class_id)

    def delete_link_by_id(self, resource_id):
        self.file_gateway.delete_link_by_id(resource_id)

    def get_by_hash(self, file_hash):
        file = self.file_gateway.get_by_hash(file_hash, self.person_entity)

        return file


class AppealUseCase(BaseUseCase):
    class_uid = 'appeal'

    def __init__(self, appeals_port):
        super().__init__(appeals_port)

        self.appeal_gateway = appeals_port.appeal_gateway
        self.person_gateway = appeals_port.person_gateway

    def create(self, appeal_entity):
        if not hasattr(appeal_entity, 'title'):
            raise Exception('Поле title необходимо заполнить')

        if not hasattr(appeal_entity, 'type'):
            raise Exception('Поле type необходимо заполнить')

        appeal_id = self.appeal_gateway.create(appeal_entity)

        return appeal_id

    def answer(self, appeal_entity, question_id):
        appeal_id = self.appeal_gateway.create(appeal_entity, question_id)

        return appeal_id

    def get_list(self, appeal_entity, person_id, self_appeals=False):
        return self.appeal_gateway.get_list(appeal_entity, self.person_gateway, person_id, self_appeals)

    def get_by_id(self, appeal_id):
        return self.appeal_gateway.get_by_id(self.person_gateway, appeal_id)

    def delete(self, appeal_id):
        self.appeal_gateway.delete(appeal_id)


class DisputeUseCase(BaseUseCase):
    class_uid = 'dispute'

    def __init__(self, dispute_port):
        super().__init__(dispute_port)

        self.dispute_gateway = dispute_port.dispute_gateway

    def get_list(self, dispute_entity, person_id, self_disputes=False):
        return self.dispute_gateway.get_list(dispute_entity, person_id, self_disputes)

    def get_by_id(self, dispute_id):
        return self.dispute_gateway.get_by_id(dispute_id)

    def create(self, dispute_entity):
        dispute_id = self.dispute_gateway.create(dispute_entity)

        if dispute_entity.resolved:
            dispute_entity.resource_id = dispute_id

            self.dispute_gateway.resolve_dispute(dispute_entity)

        return dispute_id

    def edit(self, dispute_entity):
        self.dispute_gateway.edit(dispute_entity)

        if dispute_entity.resolved:
            self.dispute_gateway.resolve_dispute(dispute_entity)

    def delete(self, dispute_id):
        self.dispute_gateway.delete(dispute_id)

    def get_category_list(self):
        category_list = self.dispute_gateway.get_category_list()

        return category_list


class ChildrenUseCase(BaseUseCase):
    class_uid = 'children'

    def __init__(self, children_port):
        super().__init__(children_port)

        self.children_gateway = children_port.children_gateway

    def get_list(self, child_entity):
        return self.children_gateway.get_list(child_entity)

    def get_by_id(self, child_entity):
        return self.children_gateway.get_by_id(child_entity)

    def create(self, child_entity):
        child_id = self.children_gateway.create(child_entity)

        return child_id

    def edit(self, child_entity):
        self.children_gateway.edit(child_entity)

    def delete(self, child_id):
        self.children_gateway.delete(child_id)


class ArticleUseCase(BaseUseCase):
    class_uid = 'article'

    def __init__(self, article_port):
        super().__init__(article_port)

        self.article_gateway = article_port.article_gateway
        self.person_gateway = article_port.person_gateway

    def create(self, article_entity):
        article_id = self.article_gateway.create(article_entity)

        return article_id

    def edit(self, article_id, article_entity):
        self.article_gateway.edit(article_id, article_entity)

    def get_by_union_id(self, article_entity):
        return self.article_gateway.get(article_entity, self.person_gateway)


class LocalizationUseCase(BaseUseCase):
    class_uid = 'localization'

    def __init__(self, localization_port):
        super().__init__(localization_port)

        self.localization_gateway = localization_port.localization_gateway

    def list(self, lang):
        return self.localization_gateway.list(lang)

    def get(self, key, lang):
        return self.localization_gateway.get(key, lang)


class LegislationUseCase(BaseUseCase):
    class_uid = 'legislation'

    def __init__(self, legislation_port):
        super().__init__(legislation_port)

        self.legislation_gateway = legislation_port.legislation_gateway

    def get_list(self, legislation_entity):
        return self.legislation_gateway.get_list(legislation_entity)

    def get_by_id(self, legislation_id):
        return self.legislation_gateway.get_by_id(legislation_id)

    def create(self, legislation_entity):
        legislation_id = self.legislation_gateway.create(legislation_entity)

        return legislation_id

    def edit(self, legislation_id, legislation_entity):
        self.legislation_gateway.edit(legislation_id, legislation_entity)

    def delete(self, legislation_id):
        self.legislation_gateway.delete(legislation_id)


class PartnerUseCase(BaseUseCase):
    class_uid = 'partner'

    def __init__(self, partner_port):
        super().__init__(partner_port)

        self.partner_gateway = partner_port.partner_gateway

    def create(self, partner_entity):
        return self.partner_gateway.create(partner_entity)

    def get_list(self, partner_entity):
        return self.partner_gateway.get_list(partner_entity)

    def get_by_id(self, partner_id):
        return self.partner_gateway.get_by_id(partner_id)

    def edit(self, partner_entity):
        self.partner_gateway.edit(partner_entity)

    def delete(self, partner_id):
        self.partner_gateway.delete(partner_id)

    def get_category_list(self):
        return self.partner_gateway.get_category_list()


class FAQUseCase(BaseUseCase):
    class_uid = 'faq'

    def __init__(self, faq_port):
        super().__init__(faq_port)

        self.faq_gateway = faq_port.faq_gateway

    def get_list(self, faq_entity):
        return self.faq_gateway.get_list(faq_entity)

    def get_by_id(self, faq_id):
        return self.faq_gateway.get_by_id(faq_id)

    def create(self, faq_entity):
        faq_id = self.faq_gateway.create(faq_entity)

        return faq_id

    def edit(self, faq_entity):
        self.faq_gateway.edit(faq_entity)

    def delete(self, faq_id):
        self.faq_gateway.delete(faq_id)


class RecordUseCase(BaseUseCase):
    class_uid = 'record'

    def __init__(self, record_port):
        super().__init__(record_port)

        self.record_gateway = record_port.record_gateway

    def get_list(self, record_entity):
        return self.record_gateway.get_list(record_entity)

    def get_by_id(self, record_id):
        return self.record_gateway.get_by_id(record_id)

    def create(self, record_entity):
        record_id = self.record_gateway.create(record_entity)

        return record_id

    def edit(self, record_entity):
        self.record_gateway.edit(record_entity)

    def delete(self, record_id):
        self.record_gateway.delete(record_id)


class OrderUseCase(BaseUseCase):
    class_uid = 'order'

    def __init__(self, order_port):
        super().__init__(order_port)

        self.order_gateway = order_port.order_gateway
        self.union_gateway = order_port.union_gateway
        self.person_gateway = order_port.person_gateway
        self.article_gateway = order_port.article_gateway

    def get_list(self, order_entity):
        return self.order_gateway.get_list(order_entity, self.union_gateway, self.person_gateway, self.article_gateway)

    def get_by_id(self, record_id):
        return self.order_gateway.get_by_id(self.union_gateway, self.person_gateway, self.article_gateway, record_id)

    def create(self, order_entity):
        order_id = self.order_gateway.create(order_entity)

        return order_id

    def edit(self, order_entity):
        self.order_gateway.edit(order_entity)

    def delete(self, order_id):
        self.order_gateway.delete(order_id)


class NotificationUseCase(BaseUseCase):
    class_uid = 'notification'

    def __init__(self, base_port):
        super().__init__(base_port)

        self.notification_gateway = base_port.notification_gateway

    def get_list(self):
        return self.notification_gateway.get_list(self.person_entity)


class PermissionUseCase(BaseUseCase):
    class_uid = 'permission'

    def __init__(self, base_port):
        super().__init__(base_port)

    def get_list(self):
        permissions = self.rules_gateway.get_permission_list()
        permission_list = []

        def existing_condition(target_permission, permission):
            return target_permission.use_case == permission.use_case and target_permission.method == permission.method

        def get_similar_permissions(target_permission):
            return [(index, permission) for index, permission in enumerate(permission_list)
                    if existing_condition(target_permission, permission)]

        for permission in permissions:
            try:
                self.permission.check(self.person_entity, permission.rules)
                permission.is_allowed = True
            except:
                permission.is_allowed = False

            similar_permissions = get_similar_permissions(permission)

            if len(similar_permissions) > 0:
                permission_index = similar_permissions[0][0]
                permission_list[permission_index].is_allowed = permission_list[
                                                                   permission_index].is_allowed and permission.is_allowed
            else:
                permission_list.append(permission)

        return permission_list


class RevisionUseCase(BaseUseCase):
    class_uid = 'revision'

    def __init__(self, revision_port):
        super().__init__(revision_port)

        self.revision_gateway = revision_port.revision_gateway
        self.question_gateway = revision_port.question_gateway
        self.answer_gateway = revision_port.answer_gateway
        self.person_gateway = revision_port.person_gateway
        self.union_gateway = revision_port.union_gateway
        self.article_gateway = revision_port.article_gateway
        self.record_gateway = revision_port.record_gateway

    def get_list(self, revision_entity):
        return self.revision_gateway.get_list(revision_entity, self.person_gateway, self.union_gateway,
                                              self.article_gateway, self.record_gateway)

    def get_by_id(self, revision_id):
        return self.revision_gateway.get_by_id(self.person_gateway, self.union_gateway,
                                               self.article_gateway, self.record_gateway, revision_id)

    def create(self, revision_entity):
        revision_id = self.revision_gateway.create(revision_entity)

        if revision_entity.status == 1:
            self.revision_gateway.publish(revision_id)

        return revision_id

    def edit(self, revision_entity):
        self.revision_gateway.edit(revision_entity)

    def publish(self, revision_id):
        self.revision_gateway.publish(revision_id)

    def delete(self, revision_id):
        self.revision_gateway.delete(revision_id)

    def finish(self, revision_id, person_id):
        return self.revision_gateway.finish(revision_id, person_id)

    def revision_test_statistic(self, revision_id):
        union_members = self.revision_gateway.union_members(revision_id)
        total_finished = self.revision_gateway.total_finished(revision_id, union_members)
        total_complete = self.revision_gateway.total_complete(revision_id, union_members)
        revision = self.get_by_id(revision_id)

        return {
            'total_union_members': len(union_members),
            'total_finished': total_finished,
            'total_complete': total_complete,
            'total_not_passed': total_finished - total_complete,
            'not_finished': len(union_members) - total_finished,
            'revision': revision
        }

    def revision_vote_statistic(self, revision_id):
        vote_statistic = self.revision_gateway.vote_statistic(revision_id, self.question_gateway, self.answer_gateway,
                                                              self.union_gateway, self.person_gateway,
                                                              self.article_gateway, self.record_gateway)

        return vote_statistic

    def person_test_statistics(self, revision_id, person_id):
        test_statistics = self.revision_gateway.person_test_statistic(revision_id, person_id)

        return test_statistics

    def revision_members(self, revision_id):
        revision_members = self.revision_gateway.revision_members(revision_id, self.person_gateway)

        return revision_members


class QuestionUseCase(BaseUseCase):
    class_uid = 'question'

    def __init__(self, question_port):
        super().__init__(question_port)

        self.answer_gateway = question_port.answer_gateway
        self.question_gateway = question_port.question_gateway
        self.revision_gateway = question_port.revision_gateway
        self.person_gateway = question_port.person_gateway
        self.union_gateway = question_port.union_gateway
        self.article_gateway = question_port.article_gateway
        self.record_gateway = question_port.record_gateway

    def get_list(self, question_entity):
        return self.question_gateway.get_list(question_entity, self.answer_gateway, self.revision_gateway,
                                              self.person_gateway, self.union_gateway, self.article_gateway,
                                              self.record_gateway)

    def get_by_id(self, question_id, person_id):
        return self.question_gateway.get_by_id(self.answer_gateway, self.revision_gateway, self.person_gateway,
                                               self.union_gateway, self.article_gateway, self.record_gateway,
                                               question_id, person_id)

    def create(self, question_entity):
        question_id = self.question_gateway.create(question_entity)

        return question_id

    def edit(self, question_entity):
        self.question_gateway.edit(question_entity)

    def delete(self, question_id):
        self.question_gateway.delete(question_id)


class CommentUseCase(BaseUseCase):
    class_uid = 'comment'

    def __init__(self, comment_port):
        super().__init__(comment_port)

        self.comment_gateway = comment_port.comment_gateway
        self.person_gateway = comment_port.person_gateway

    def get_list(self, comment_entity):
        return self.comment_gateway.get_list(comment_entity, self.person_gateway)

    def create(self, comment_entity):
        comment_id = self.comment_gateway.create(comment_entity)

        return comment_id


class AnswerUseCase(BaseUseCase):
    class_uid = 'answer'

    def __init__(self, answer_port):

        super().__init__(answer_port)

        self.answer_gateway = answer_port.answer_gateway
        self.person_gateway = answer_port.person_gateway

    def get_list(self, answer_entity, person_id):
        return self.answer_gateway.get_list(answer_entity, self.person_gateway, person_id)

    def create(self, answer_entity):
        answer_id = self.answer_gateway.create(answer_entity)

        return answer_id

    def edit(self, answer_id, answer_entity):
        self.answer_gateway.edit(answer_id, answer_entity)

    def delete(self, answer_id):
        self.answer_gateway.delete(answer_id)


class PersonAnswerUseCase(BaseUseCase):
    class_uid = 'person_answer'

    def __init__(self, person_answer_port):
        super().__init__(person_answer_port)

        self.person_answer_gateway = person_answer_port.person_answer_gateway
        self.answer_gateway = person_answer_port.answer_gateway

    def create(self, person_answer_entity):
        person_answer_id = self.person_answer_gateway.create(person_answer_entity, self.answer_gateway)

        return person_answer_id


class NotificationUseCase(BaseUseCase):
    class_uid = 'notification'

    def __init__(self, notification_port):
        super().__init__(notification_port)

        self.notification_gateway = notification_port.notification_gateway

    def get_list(self, notification_entity, person_id):
        return self.notification_gateway.get_list(notification_entity, person_id)

    def read_notification(self, notification_id, person_id):
        self.notification_gateway.read_notification(notification_id, person_id)


class ReportUseCase(BaseUseCase):
    class_uid = 'report'

    def __init__(self, report_port):
        super().__init__(report_port)

        self.report_gateway = report_port.report_gateway
        self.file_gateway = report_port.file_gateway

    def get_list(self, report_entity, person_id):
        return self.report_gateway.get_list(report_entity, person_id)

    def create(self, report_entity, person_id):
        return self.report_gateway.create(report_entity, self.file_gateway, person_id)

    def update(self, report_entity):
        return self.report_gateway.create(report_entity, self.file_gateway)
