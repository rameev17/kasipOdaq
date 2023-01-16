from django.urls import path, include

from rest_framework.routers import DefaultRouter

from union_app import views

router = DefaultRouter()
router.register('unions', views.UnionViewSet, basename='unions')
router.register('news', views.NewsViewSet, basename='news')
router.register('appeals', views.AppealViewSet, basename='appeals')
router.register('union_applications', views.UnionApplicationViewSet, basename='union_applications')
router.register('disputes', views.DisputeViewSet, basename='disputes')
router.register('articles', views.ArticleViewSet, basename='articles')
router.register('legislation', views.LegislationViewSet, basename='legislation')
router.register('members', views.MemberViewSet, basename='members')
router.register('faqs', views.FAQViewSet, basename='faqs'),
router.register('partners', views.PartnerViewSet, basename='partners'),
router.register('records', views.RecordViewSet, basename='records')
router.register('orders', views.OrderViewSet, basename='orders')
router.register('permissions', views.PermissionViewSet, basename='permissions')
router.register('notifications', views.NotificationViewSet, basename='notifications')
router.register('revisions', views.RevisionViewSet, basename='revisions')
router.register('questions', views.QuestionViewSet, basename='questions')
router.register('comment', views.CommentViewSet, basename='comment')
router.register('answers', views.AnswerViewSet, basename='answers')
router.register('person_answers', views.PersonAnswerViewSet, basename='person_answers')
router.register('children', views.ChildrenViewSet, basename='children')
router.register('report', views.ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
    path('auth', views.authorize),
    path('register', views.register),
    path('send_sms', views.send_sms),
    path('confirm_sms', views.confirm_sms),
    path('industries', views.get_industries),
    path('place_associations', views.get_place_associations),
    path('union_associations', views.get_union_associations),
    path('join_union', views.join_union),
    path('create_union', views.create_union),
    path('confirm_application', views.confirm_union_application),
    path('reject_application', views.reject_union_application),
    path('delete_application', views.delete_union_application),
    path('upload_file', views.upload_file),
    path('delete_file', views.delete_file),
    path('delete_file_link', views.delete_file_link),
    path('restore_password', views.restore_password),
    path('change_password', views.change_password),
    path('profile', views.get_profile),
    path('profile_edit', views.edit_profile),
    path('self_union', views.get_self_union),
    path('finish_revision', views.finish),
    path('revision_test_statistic', views.revision_test_statistic),
    path('revision_vote_statistic', views.revision_vote_statistic),
    path('person_test_statistic', views.person_test_statistic),
    path('revision_members', views.revision_members),
    path('read_notification', views.read_notification),
    path('delete_person_picture', views.delete_person_picture),
    path('union_picture', views.union_picture),
    path('edit_setting/<int:pk>/', views.edit_setting),
    path('create_union_member', views.create_union_member),
    path('set_union_master', views.set_union_master),
    path('unions_by_person', views.unions_by_person),
    path('service_localization', views.service_localization),
    path('all_service_localization', views.all_service_localization),
    path('verify_captcha', views.verify_captcha),
    path('members/import', views.import_members),
    path('children/import', views.import_children),
    # path('static/<str:filename>', views.get_file),
]
