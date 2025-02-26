import bcrypt

class BcryptService:
    @staticmethod
    def hash_password(password):
        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

        return hashed_password

    @staticmethod
    def check_password(stored_password, input_password):
        input_password_bytes = input_password.encode('utf-8')
        
        return bcrypt.checkpw(input_password_bytes, stored_password)
