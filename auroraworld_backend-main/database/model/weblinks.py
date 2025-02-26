from django.db import models

CATEGORY_CHOICES = [
    ('favorites', '개인즐겨찾기'),
    ('work', '업무 활용자료'),
    ('reference', '참고자료'),
    ('education', '교육 및 학습자료'),
]

class WebLink(models.Model):
    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey('User', related_name='created_by', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image_url = models.URLField(max_length=500, blank=True, null=True)  
    shared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'weblinks'

    def __str__(self):
        return f"WebLink(id={self.id}, created_by={self.created_by}, name={self.name}, url={self.url}, category={self.category}, image_url={self.image_url}, shared={self.shared}, created_at={self.created_at}, updated_at={self.updated_at})"
