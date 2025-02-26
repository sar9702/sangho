from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)  
    username = models.CharField(max_length=255, unique=True) 
    password = models.BinaryField() 
    refresh = models.BinaryField(default=b'auroraworld')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users' 

    def __str__(self):
        return f"User(id={self.id}, username={self.username}, password={self.password}, refresh={self.refresh}, created_at={self.created_at}, created_at={self.updated_at})"