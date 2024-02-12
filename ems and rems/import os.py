import os
import pandas as pd
import requests
from bs4 import BeautifulSoup

# Set working directory
os.chdir("C:\\Users\\Training 20\\Desktop\\Real_Estate\\buyRent 2024")

# Number of pages to scrape
num_pages = 400

for page_number in range(201, num_pages + 1):
    # Define the URL for each page
    url = f"https://www.buyrentkenya.com/property-for-sale?page={page_number}"

    # Make a request to the website
    response = requests.get(url)

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract data
    name = [item.get_text(strip=True) for item in soup.select('.font-semibold.flex')]
    name = [item.replace('\n', '') for item in name]

    property_links = [f"https://www.buyrentkenya.com{item['href']}" for item in soup.select('.capitalize .text-black')[::2]]

    price = [item.get_text(strip=True) for item in soup.select('#mainContent .text-grey-900 .no-underline')]
    price = [item.replace('\n', '') for item in price]

    # Get property details
    def get_cast(property_link):
        response_property = requests.get(property_link)
        soup_property = BeautifulSoup(response_property.text, 'html.parser')
        cast = [item.get_text(strip=True) for item in soup_property.select('.overflow-hidden.break-words, .py-2 .font-semibold')]
        return ', '.join(cast)

    # Check lengths
    print(f"\nPage {page_number}:")
    print("Length of name:", len(name))
    print("Length of price:", len(price))
    print("Length of property_links:", len(property_links))

    # Ensure all lists have the same length
    min_length = min(len(name), len(price), len(property_links))
    name = name[:min_length]
    price = price[:min_length]
    property_links = property_links[:min_length]

    cast = [get_cast(link) for link in property_links]

    # Check lengths again
    print("Length of name after adjustment:", len(name))
    print("Length of price after adjustment:", len(price))
    print("Length of property_links after adjustment:", len(property_links))
    print("Length of cast:", len(cast))

    # Create a DataFrame
    properties = pd.DataFrame({
        'Name': name,
        'Price': price,
        'PropertyLinks': property_links,
        'Cast': cast
    })

    # Save to CSV with header only if the file doesn't exist
    properties.to_csv("Buyrent.csv", mode='a', header=not os.path.exists("Buyrent.csv"), index=False)
