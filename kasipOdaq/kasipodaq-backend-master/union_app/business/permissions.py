class Permission:
    def equals(self, variable, value):
        return variable == value

    def contains(self, variable_list, value):
        return value in variable_list

    def check(self, entity, rules):
        has_permission = False

        for rule in rules:
            entity_property = getattr(entity, rule['property'], None)
            condition = getattr(self, rule['condition'])

            has_permission = has_permission or condition(entity_property, rule['value'])

        if not has_permission and len(rules) > 0:
            raise AttributeError('Нет доступа')


def set_permissions(target_class):
    class ClassWrapper:
        def __init__(self, *args, **kwargs):
            self.target_class_instance = target_class(*args, **kwargs)

        def __getattribute__(self, item):
            try:
                base_attribute = super().__getattribute__(item)
                return base_attribute
            except AttributeError:
                pass

            person_entity = getattr(self.target_class_instance, 'person_entity')

            rules_gateway = getattr(self.target_class_instance, 'rules_gateway')
            class_uid = getattr(self.target_class_instance, 'class_uid', None)

            rules_list = rules_gateway.get_list(class_uid, item)

            for rules in rules_list:
                getattr(self.target_class_instance, 'permission').check(person_entity, rules)

            return getattr(self.target_class_instance, item)

    return ClassWrapper
