import hashlib

from typing import List, Dict


class Entity:
    pass


class RootUnion(Entity):
    resource_id: int
    name: str


class UnionApplication(Entity):
    resource_id: int
    type: int
    person: object
    union_name: str
    files: list = []


class Union(Entity):
    resource_id: int
    picture: dict
    application = UnionApplication()
    member_count: int
    name: str
    localizations: list
    city_name: str
    kind: str
    has_child: bool
    industry = RootUnion()
    root_union = RootUnion()
    association_union = RootUnion()
    creator: object
    bread_crumbs: list


class Person(Entity):
    resource_id: int
    first_name: str
    family_name: str
    patronymic: str = None
    birthday: str = None
    phone: str
    sex: str = None
    picture_uri: str = None
    uid: str
    individual_number: str
    job_position: str = None
    address: str = None
    union: Union()
    setting: object
    member_status: int


class Settings(Entity):
    resource_id: int
    person: Person()
    enable_notice: bool
    language_code: str


class User(Entity):
    resource_id: int
    person: Person()
    phone: str
    _password: str
    ip: str
    token: str
    roles: List[str]
    status: int

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = hashlib.sha512(('JYuHliLW6a1yfo1WcC' + password).encode('utf-8')).hexdigest()


class ShortMessage(Entity):
    resource_id: int
    method: str
    phone: str
    code: str
    status: int


class File(Entity):
    person = Person()
    __name: str
    size: int
    content_type: str
    __content: bytes
    hash: str
    extension: str
    file_type: str
    file_class: str

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name):
        self.extension = name.split('.')[-1]
        self.__name = name.replace(f'.{self.extension}', '')

    @property
    def content(self):
        return self.__content

    @content.setter
    def content(self, content):
        self.__content = content
        self.hash = hashlib.md5(content).hexdigest()


class News(Entity):
    person = Person()
    picture = File()
    picture_id: int
    localizations: list
    title: str
    short_content: str
    content: str
    picture_uri: str
    preview_uri: str
    source: str
    __is_published: bool = False
    status: int
    created_date: str
    updated_date: str

    @property
    def is_published(self):
        return self.__is_published

    @is_published.setter
    def is_published(self, is_published):
        self.__is_published = is_published
        self.status = is_published


class Appeal(Entity):
    answer = Entity()
    type: int
    person = Person()
    union = Union()
    files: list
    title: str
    content: str
    status: int
    created_date: str
    updated_date: str


class Article(Entity):
    person = Person()
    union = Union()
    parent_articles: bool
    self: bool
    key: str
    title: str
    content: str
    localizations: list
    files: list
    status: int
    created_date: str
    updated_date: str


class Legislation(Entity):
    parent = Entity()
    parent_id: int
    children: list
    localizations: list
    title: str
    bread_crumbs: list
    content: str
    created_date: str
    updated_date: str


class Record(Entity):
    parent = Entity()
    book: str
    name: str
    localizations: list
    sort: int
    created_date: str
    updated_date: str


class Dispute(Entity):
    person = Person()
    category = Entity()
    title: str
    thesis: str
    solution: str
    localizations: list
    start_date: str
    finish_date: str
    status: int
    __resolved: bool = False

    @property
    def resolved(self):
        return self.__resolved

    @resolved.setter
    def resolved(self, resolved):
        self.__resolved = resolved
        self.status = resolved


class Child(Entity):
    person = Person()
    full_name: str
    personal_code: int
    birth_date: str
    age: int


class Partner(Entity):
    resource_id: int
    localizations: list
    name: str
    picture_uri: str
    description: str
    references: list


class FAQ(Entity):
    question: str
    answer: str
    created_date: str
    updated_date: str


class Order(Entity):
    person = Person()
    union = Union()
    title: str
    files: list
    status: int
    created_date: str
    updated_date: str


class Rule(Entity):
    use_case: str
    method: str
    is_allowed: str


class RevisionStatistics(Entity):
    total_questions: int
    valid_answers: int
    is_passed: bool


class Revision(Entity):
    union = Union()
    person = Person()
    type = Record()
    stats = RevisionStatistics()
    questions: list
    name: str
    decree: str
    is_answered: bool
    percent_threshold: int
    total_union_members: int
    total_finished: int
    not_finished: int
    start_date: str
    finish_date: str
    is_archive: bool
    status: int


class Question(Entity):
    revision = Revision()
    question: str
    answers: list
    has_alternate_answer: bool


class Comment(Entity):
    question = Question()
    author = Person()
    comment: str


class Answer(Entity):
    question = Question()
    answer: str
    person = Person()
    alternate_answer: str
    is_user_answer: bool
    is_right: bool
    total_responded: int


class PersonAnswer(Entity):
    question = Question()
    answer = Answer()
    alternate_answer: str
    person = Person()


class RevisionUnionStatistic(Entity):
    union = Union()
    total_members: int
    total_finished: int
    unfinished: int


class Notification(Entity):
    resource_id: int
    union = Union()
    notification_class: str
    record_id: int
    content: str
    is_seen: bool


class PersonNotification(Entity):
    resource_id: int
    person = Person()
    notification: list


class Report(Entity):
    resource_id: int
    union = Union()
    name: str
    date_created: str
    file = File()
    type = Entity()
    fields: list
