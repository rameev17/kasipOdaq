from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, phone, password, **extra_fields):
        if phone is None:
            raise Exception('Необходимо указать номер телефона')

        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save()

        return user

