"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""


class DBComments(object):
    """Mixin to support database metadata."""

    # Subclasses should override if needed.
    db_table_comment = None

    @classmethod
    def db_table_name(cls):
        """database table name"""
        meta = getattr(cls, '_meta', None)
        return meta.db_table if meta else None

    @classmethod
    def db_table_comment_or_name(cls):
        """database table comment (default to name if unset)"""
        return cls.db_table_comment or cls.__name__

    @classmethod
    def db_column_comments(cls):
        """database table column comments, including supplemental overrides"""
        column_comments = {}

        for field in cls._meta.fields:
            if hasattr(field, 'db_comment'):
                column_comments[field.column] = field.db_comment

        # breadth-first traversal up the class tree looking for supplemental comments
        inspection_list = [cls]
        visited = []

        while inspection_list:
            current = inspection_list.pop()

            if current in visited:
                # Don't look in the same place twice
                continue

            visited.append(current)

            if issubclass(current, DBComments):
                if hasattr(current, 'db_column_supplemental_comments'):
                    for column, comment in current.db_column_supplemental_comments.items():
                        column_comments[column] = comment

            inspection_list = inspection_list + list(current.__bases__)

        return column_comments
