from rest_framework.pagination import PageNumberPagination

class BasicPagination(PageNumberPagination):
    page_size_query_param = 'size'