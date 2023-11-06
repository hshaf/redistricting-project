import geopandas
import matplotlib.pyplot as plt
from constants import *


# Path for output HTML file
OUTPUT_PATH = "../va_districts.html"

def visualize_districts():
	va_cd = geopandas.read_file(VA_DEMOGRAPHIC_PATH)
	m = va_cd.explore()
	m.save(OUTPUT_PATH)

def main():
	visualize_districts()

if __name__ == "__main__":
	main()
