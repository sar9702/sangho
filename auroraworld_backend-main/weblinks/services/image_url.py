from bs4 import BeautifulSoup
import requests

class ImageUrlService:
    @staticmethod
    def generate_image_url(url):
        response = requests.get(url)
        
        soup = BeautifulSoup(response.content, 'html.parser')
        image_url = soup.find('meta', {'property': 'og:image'})['content'] if soup.find('meta', {'property': 'og:image'}) else ""
        
        return image_url
