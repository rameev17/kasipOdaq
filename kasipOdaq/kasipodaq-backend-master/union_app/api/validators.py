class RequiredFieldsValidator:
    @staticmethod
    def validate(request_fields, required_fields):
        errors = []

        for required_field in required_fields:
            if required_field not in request_fields:
                errors.append({'message': f'Поле {required_field} необходимо заполнить'})

        return errors


class PasswordValidator:
    @staticmethod
    def validate(password: str) -> list:
        """
        Checks if passwords meets requirements
        """
        errors = []

        if len(password) < 6:
            errors.append({'message': 'Длина пароля должна быть более 5 символов'})
        if not any(char.isdigit() for char in password):
            errors.append({'message': 'Пароль должен содержать хотя бы одну цифру'})
        if not any(char.isupper() for char in password):
            errors.append({'message': 'Пароль должен содержать хотя бы одну букву верхнего регистра'})
        if not any(char.islower() for char in password):
            errors.append({'message': 'Пароль должен содержать хотя бы одну букву нижнего регистра'})

        return errors
