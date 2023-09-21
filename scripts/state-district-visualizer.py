import geopandas
import matplotlib.pyplot as plt


# Modify this accordingly
DATA_PATH = "../data/va_cong_adopted_2021.zip"
# Path for output HTML file
OUTPUT_PATH = "../va_districts.html"

def visualize_districts():
	va_cd = geopandas.read_file(DATA_PATH)
	m = va_cd.explore()
	m.save(OUTPUT_PATH)

def main():
	visualize_districts()

if __name__ == "__main__":
	main()
