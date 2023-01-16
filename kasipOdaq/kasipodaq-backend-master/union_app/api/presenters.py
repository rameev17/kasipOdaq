from ..business.entities import Entity


class Presenter:
    def __convert(self, entity, needed_fields, max_depth, depth=0):
        depth += 1

        data = {}

        for field_name in needed_fields:
            if type(entity) == dict and field_name in entity:
                data = entity
            elif hasattr(entity, field_name):
                attr = getattr(entity, field_name)

                if isinstance(attr, Entity):
                    data[field_name] = None if depth >= max_depth else \
                        self.__convert(attr, attr.__dict__.keys(), max_depth, depth=depth)
                elif type(attr) == dict:
                    data[field_name] = None if depth >= max_depth else attr
                elif type(attr) == list:
                    data[field_name] = [
                        item if type(item) != dict or type(item) != Entity
                        else
                        self.__convert(
                            item, item.keys() if type(item) == dict else item.__dict__.keys(),
                            max_depth,
                            depth=depth
                        ) for item in attr
                    ]
                else:
                    data[field_name] = getattr(entity, field_name)

        return data

    def to_dict_response(self, entity, max_depth=1, needed_fields=None):
        needed_fields = entity.__dict__.keys() if needed_fields is None else needed_fields

        response = self.__convert(entity, needed_fields, max_depth)

        return response

    def to_list_response(self, entities, max_depth=1, needed_fields=None):
        response = []

        for entity in entities:
            response.append(self.to_dict_response(entity, max_depth, needed_fields))

        return response