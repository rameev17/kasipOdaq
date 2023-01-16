from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import AbstractUser

from .managers import UserManager


class Currency(models.Model):
    code = models.CharField(max_length=255, unique=True)
    sort = models.SmallIntegerField(null=True)

    text_fields = ['code']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'currencies'


class Language(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=150, null=True)
    is_primary = models.BooleanField(default=False)
    sort = models.SmallIntegerField(null=True)

    text_fields = ['code', 'name']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'languages'


class Book(models.Model):
    book_class = models.CharField(max_length=255)
    is_tree = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.SmallIntegerField(default=1)

    text_fields = ['book_class']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'books'


class Record(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='Records')
    parent = models.ForeignKey('Record', on_delete=models.CASCADE, related_name='Children', null=True)
    uid = models.CharField(max_length=255, null=True)
    sort = models.IntegerField(null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.SmallIntegerField(default=1, null=True)

    text_fields = ['uid']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'records'


class Country(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=10, unique=True)

    text_fields = ['name', 'code']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'countries'


class TimeZone(models.Model):
    time_zone = models.CharField(max_length=64, unique=True)
    country_code = models.ForeignKey(Country, to_field='code', on_delete=models.CASCADE, related_name='country')
    gmt = models.DecimalField(max_digits=4, decimal_places=2)

    text_fields = ['time_zone']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'time_zones'


class Region(models.Model):
    name = models.CharField(max_length=255, null=True)
    code = models.CharField(max_length=10)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)

    text_fields = ['name', 'code']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'regions'


class City(models.Model):
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    region = models.ForeignKey(Region, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)

    text_fields = ['name']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'cities'


class GeoAlternative(models.Model):
    type = models.ForeignKey(Record, on_delete=models.PROTECT, related_name='GeoAlternative')
    record_id = models.IntegerField()
    language_code = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='GeoAlternative')
    name = models.CharField(max_length=200, unique=True)

    text_fields = ['name']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'place_alternates'


class Person(models.Model):
    first_name = models.CharField(max_length=255)
    family_name = models.CharField(max_length=255, null=True)
    middle_name = models.CharField(max_length=255, null=True)
    patronymic = models.CharField(max_length=255, null=True)
    individual_number = models.CharField(max_length=255, null=True)
    job_position = models.CharField(max_length=255, null=True)
    uid = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    status = models.SmallIntegerField(default=0, null=True)

    text_fields = ['first_name', 'family_name', 'middle_name', 'patronymic', 'individual_number', 'job_position', 'uid']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'persons'


class Setting(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='person_settings')
    language_code = models.CharField(max_length=20, default='ru')
    enable_notice = models.BooleanField(default=True)

    text_fields = ['language_code']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'settings'


class PersonAttribute(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='person_attributes')
    property = models.ForeignKey(Record, on_delete=models.CASCADE)
    value = models.CharField(max_length=255, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    text_fields = ['value']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = str(getattr(self, field)).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'person_attributes'


class User(AbstractUser):
    username = None
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    phone = models.CharField(max_length=25, unique=True)
    role = models.CharField(max_length=50, default='user')
    roles = ArrayField(base_field=models.CharField(max_length=255), null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=1)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    text_fields = ['phone']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'users'


class File(models.Model):
    author = models.ForeignKey(Person, on_delete=models.CASCADE, null=True)
    hash = models.CharField(max_length=128)
    extension = models.CharField(max_length=32)
    size = models.BigIntegerField()
    name = models.TextField()
    content_type = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'files'


class FileLink(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='Links')
    file_class = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='files', null=True)
    record_id = models.IntegerField(null=True)
    type = models.ForeignKey(Record, on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'file_links'


class Union(models.Model):
    parent = models.ForeignKey('Union', on_delete=models.CASCADE, related_name='children', null=True)
    creator = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='union_creator')
    association = models.ForeignKey('Union', on_delete=models.CASCADE, related_name='association_children', null=True)
    type = models.CharField(max_length=255, default='union')
    sort = models.IntegerField(default=99999)
    status = models.IntegerField(default=0)

    class Meta:
        db_table = 'unions'


class UnionMember(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='unions')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='person_members')
    join_date = models.DateTimeField(null=True)
    leave_date = models.DateTimeField(null=True)
    reason = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=0)

    text_fields = ['reason']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'union_members'


class News(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='news')
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    published_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=0)

    class Meta:
        db_table = 'news'


class NewsLocalization(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='news_localizations')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='news_localizations')
    title = models.CharField(max_length=255, unique=False)
    short_content = models.TextField(max_length=255, unique=False)
    content = models.TextField(max_length=255, unique=False)
    source = models.CharField(max_length=255, unique=False)

    text_fields = ['title', 'short_content', 'content', 'source']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'news_localizations'


class Rule(models.Model):
    use_case = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='RuleUseCase')
    method = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='RuleMethod')
    rules = models.TextField(max_length=255, unique=False)
    is_allow = models.BooleanField(default=True)

    text_fields = ['rules']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'rules'


class Localization(models.Model):
    attribute_class = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='Localizations')
    record_id = models.IntegerField()
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='Localizations')
    key = models.CharField(max_length=255, unique=False)
    value = models.CharField(max_length=255, unique=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.IntegerField(default=1)

    text_fields = ['key', 'value']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'localizations'


class ShortMessage(models.Model):
    phone = models.CharField(max_length=255)
    code = models.CharField(max_length=6)
    status = models.IntegerField(default=1)
    created_date = models.DateTimeField(auto_now_add=True)

    text_fields = ['phone', 'code']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'short_messages'


class Appeal(models.Model):
    parent = models.ForeignKey('Appeal', on_delete=models.CASCADE, related_name='Answer', null=True)
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='Appeal', null=True)
    type = models.IntegerField()
    member = models.ForeignKey(UnionMember, on_delete=models.CASCADE, related_name='Author')
    title = models.CharField(max_length=255, null=True)
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.IntegerField(default=0)

    text_fields = ['title', 'content']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'appeals'


class Article(models.Model):
    type = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='articles', null=True)
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='articles', null=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='articles')
    key = models.CharField(max_length=255)
    sort = models.IntegerField(null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.IntegerField(default=1)

    class Meta:
        db_table = 'articles'


class ArticleLocalization(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='article_localization')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='article_localization')
    title = models.CharField(max_length=255, null=True)
    content = models.TextField(max_length=255, unique=False)

    text_fields = ['title', 'content']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'article_localizations'


class Dispute(models.Model):
    member = models.ForeignKey(UnionMember, on_delete=models.CASCADE, related_name='Disputes')
    category = models.ForeignKey(Record, default=1, on_delete=models.CASCADE, related_name='Disputes')
    start_date = models.DateTimeField(auto_now_add=True)
    finish_date = models.DateTimeField(null=True)
    status = models.IntegerField(default=0)

    class Meta:
        db_table = 'disputes'


class DisputeLocalization(models.Model):
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name='dispute_localizations')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='dispute_localizations')
    title = models.TextField()
    thesis = models.TextField()
    solution = models.TextField()

    text_fields = ['title', 'thesis', 'solution']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'dispute_localizations'


class Legislation(models.Model):
    parent = models.ForeignKey('Legislation', on_delete=models.CASCADE, related_name='children', null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'legislation'


class LegislationLocalization(models.Model):
    legislation = models.ForeignKey(Legislation, on_delete=models.CASCADE, related_name='legislation_localization')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='legislation_localization')
    title = models.TextField()
    content = models.TextField(null=True)

    text_fields = ['title', 'content']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'legislation_localizations'


class Partner(models.Model):
    category = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='partners')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'partners'


class PartnerLocalization(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='partner_localizations')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='partner_localizations')
    name = models.TextField()
    description = models.TextField()

    text_fields = ['name', 'description']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'partner_localizations'


class PartnerReference(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='partner_references')
    type = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='partner_references', null=True)
    link = models.TextField()

    text_fields = ['link']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'partner_references'


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    text_fields = ['question', 'answer']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'faqs'


class Order(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='Orders')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Orders')
    title = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.IntegerField(default=1)

    text_fields = ['title']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'orders'


class Group(models.Model):
    group_class = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='Groups')
    key = models.CharField(max_length=255, unique=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Groups', null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    status = models.IntegerField(default=1)

    text_fields = ['key']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'groups'


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='GroupMembers')
    record_id = models.IntegerField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'group_members'


class GroupDomain(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='GroupDomains')
    domain_name = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='GroupDomains')
    record_id = models.IntegerField()

    class Meta:
        db_table = 'group_domains'


class Revision(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='Revisions')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Revisions')
    type = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='Revisions')
    percent_threshold = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    start_date = models.DateTimeField()
    finish_date = models.DateTimeField()
    status = models.IntegerField(default=0)

    class Meta:
        db_table = 'revisions'


class Question(models.Model):
    revision = models.ForeignKey(Revision, on_delete=models.CASCADE, related_name='Questions')
    has_alternate_answer = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'questions'


class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='Comments')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Comments')
    comment = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    text_fields = ['comment']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'comments'


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='Answers')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Answers', null=True)
    alternate_answer = models.TextField(null=True)
    is_right = models.BooleanField(default=False)
    total_responded = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    text_fields = ['alternate_answer']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'answers'


class PersonAnswer(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='PersonAnswers')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='PersonAnswers')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'person_answers'


class RevisionLocalization(models.Model):
    attribute_class = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='RevisionLocalizations')
    record_id = models.IntegerField()
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='RevisionLocalizations')
    key = models.CharField(max_length=255, unique=False)
    value = models.TextField()

    text_fields = ['key', 'value']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'revision_localizations'


class RevisionStatistics(models.Model):
    revision = models.ForeignKey(Revision, on_delete=models.CASCADE, related_name='RevisionStatistics')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='RevisionStatistics')
    total_questions = models.IntegerField(default=0)
    valid_answers = models.IntegerField(default=0)
    is_passed = models.BooleanField(default=False)

    class Meta:
        db_table = 'revision_statistics'


class Notification(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='Notifications', null=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Notifications', null=True)
    attribute_class = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='Notifications')
    record_id = models.IntegerField()
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True, null=True)

    text_fields = ['content']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'notifications'


class PersonNotification(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='PersonNotification')
    read_notification = ArrayField(base_field=models.IntegerField(), default=list)

    class Meta:
        db_table = 'person_notifications'


class Children(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Child')
    family_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255, null=True)
    sex = models.BooleanField()
    personal_code = models.CharField(max_length=24)
    birth_date = models.DateTimeField()

    text_fields = ['family_name', 'first_name', 'patronymic']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'children'


class Report(models.Model):
    union = models.ForeignKey(Union, on_delete=models.CASCADE, related_name='Reports')
    type = models.ForeignKey(Record, on_delete=models.CASCADE, related_name='Reports')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'reports'


class LoginAttempt(models.Model):
    ip = models.GenericIPAddressField()
    phone = models.CharField(max_length=30)
    attempts = models.IntegerField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    text_fields = ['phone']

    def save(self, *args, **kwargs):
        for field in self.text_fields:
            text = getattr(self, field)
            if text is not None:
                text = getattr(self, field).replace('<script>', '').replace('</script>', '')
            setattr(self, field, text)

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'login_attempts'


class ShortMessageAttempt(models.Model):
    ip = models.GenericIPAddressField()
    phone = models.CharField(max_length=30)
    attempts = models.IntegerField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'short_message_attempts'


class AccessPermission(models.Model):
    entity_class = models.ForeignKey(Record, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
    is_owner = models.BooleanField()
    allowed_fields = ArrayField(base_field=models.CharField(max_length=255))
    has_access = models.BooleanField(default=True)
    view_basename = models.CharField(max_length=255)

    class Meta:
        db_table = 'access_permissions'
