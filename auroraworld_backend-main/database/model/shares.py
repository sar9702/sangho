from django.db import models

PERMISSION_CHOICES = [
    ('read', 'Read'),
    ('write', 'Write'),
]

class Share(models.Model):
    id = models.AutoField(primary_key=True)
    shared_with_user = models.ForeignKey('User', related_name='received_shares', on_delete=models.CASCADE) 
    shared_by_weblink = models.ForeignKey('WebLink', related_name='given_shares', on_delete=models.CASCADE)  
    permission = models.CharField(max_length=5, choices=PERMISSION_CHOICES) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shares'
        unique_together = ('shared_with_user', 'shared_by_weblink')

    def __str__(self):
        return f"Share(id={self.id}, shared_with_user={self.shared_with_user}, shared_by_weblink={self.shared_by_weblink}, permission={self.permission}, created_at={self.created_at}, updated_at={self.updated_at})"
