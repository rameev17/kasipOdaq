from . import entities
from . import gateways


class InputPort:
    def __init__(self, user_role, person_id, context=None):
        self.user_entity = entities.User()

        self.user_role = user_role
        self.person_entity = None
        self.rules_gateway = gateways.RuleGateway(user_role, person_id, context)
        self.person_gateway = gateways.PersonGateway(user_role, person_id, context)
        self.union_gateway = gateways.UnionGateway(user_role, person_id, context)
        self.article_gateway = gateways.ArticleGateway(user_role, person_id, context)
        self.notification_gateway = gateways.NotificationGateway(user_role, person_id, context)


class UserInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.user_gateway = gateways.UserGateway(user_role, person_id, context)
        self.sms_gateway = gateways.ShortMessageGateway(user_role, person_id, context)
        self.file_gateway = gateways.FileGateway(user_role, person_id, context)


class SettingsInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.settings_gateway = gateways.SettingsGateway(user_role, person_id, context)


class SMSInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.sms_gateway = gateways.ShortMessageGateway(user_role, person_id, context)
        self.user_gateway = gateways.UserGateway(user_role, person_id, context)


class UnionInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.user_gateway = gateways.UserGateway(user_role, person_id, context)
        self.sms_gateway = gateways.ShortMessageGateway(user_role, person_id, context)
        self.file_gateway = gateways.FileGateway(user_role, person_id, context)
        self.children_gateway = gateways.ChildrenGateway(user_role, person_id, context)


class NewsInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.news_gateway = gateways.NewsGateway(user_role, person_id, context)


class LocalizationInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.localization_gateway = gateways.LocalizationGateway(user_role, person_id, context)


class FileInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.file_gateway = gateways.FileGateway(user_role, person_id, context)


class AppealInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.appeal_gateway = gateways.AppealGateway(user_role, person_id, context)


class DisputeInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.dispute_gateway = gateways.DisputeGateway(user_role, person_id, context)


class ChildrenInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.children_gateway = gateways.ChildrenGateway(user_role, person_id, context)


class ReportInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.report_gateway = gateways.ReportGateway(user_role, person_id, context)
        self.file_gateway = gateways.FileGateway(user_role, person_id, context)


class ArticleInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)


class LegislationInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.legislation_gateway = gateways.LegislationGateway(user_role, person_id, context)


class PartnerInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.partner_gateway = gateways.PartnerGateway(user_role, person_id, context)


class FAQInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.faq_gateway = gateways.FAQGateway(user_role, person_id, context)


class RecordInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.record_gateway = gateways.RecordGateway(user_role, person_id, context)


class OrderInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.order_gateway = gateways.OrderGateway(user_role, person_id, context)


class RevisionInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.revision_gateway = gateways.RevisionGateway(user_role, person_id, context)
        self.record_gateway = gateways.RecordGateway(user_role, person_id, context)
        self.question_gateway = gateways.QuestionGateway(user_role, person_id, context)
        self.answer_gateway = gateways.AnswerGateway(user_role, person_id, context)


class QuestionInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.revision_gateway = gateways.RevisionGateway(user_role, person_id, context)
        self.record_gateway = gateways.RecordGateway(user_role, person_id, context)
        self.question_gateway = gateways.QuestionGateway(user_role, person_id, context)
        self.answer_gateway = gateways.AnswerGateway(user_role, person_id, context)


class CommentInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.comment_gateway = gateways.CommentGateway(user_role, person_id, context)
        self.person_gateway = gateways.PersonGateway(user_role, person_id, context)


class AnswerInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.revision_gateway = gateways.RevisionGateway(user_role, person_id, context)
        self.record_gateway = gateways.RecordGateway(user_role, person_id, context)
        self.article_gateway = gateways.ArticleGateway(user_role, person_id, context)
        self.answer_gateway = gateways.AnswerGateway(user_role, person_id, context)


class PersonAnswerInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.answer_gateway = gateways.AnswerGateway(user_role, person_id, context)
        self.person_answer_gateway = gateways.PersonAnswerGateway(user_role, person_id, context)


class NotificationInputPort(InputPort):
    def __init__(self, user_role='guest', person_id=None, context=None):
        super().__init__(user_role, person_id, context)

        self.notification_status_entity = entities.Notification()

        self.notification_gateway = gateways.NotificationGateway(user_role, person_id, context)
