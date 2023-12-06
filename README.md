# redistricting-project
Team Giants 🗽🟦

This repository contains the client and server implementation of our web application, as part of our capstone final project for CSE 416. Users can visualize and analyze clusters within an ensemble of randomized district plans. Generation of randomized district plans are performed on the SeaWulf high-performance computing clusters.
## Authors
- Hamza Shafiq
- Marcus Pang
- Jake Hoffman
- Anthony Tran
## Dependencies
1. Python 3.11.5
2. [GeoPandas](https://geopandas.org/en/stable/getting_started/install.html)
3. Install remaining Python libraries
   
   `pip3 install -r requirements.txt`

4. Node.js and npm
5. Java Development Kit 17.0.8
6. Maven
7. MongoDB Community Server 7.0.2
8. MongoDB Compass 1.40.3
## Run Web App
1. Under `client/`, install required packages

   `npm install` (use `npm install --legacy-peer-deps` if any compatibility issues)
   
2. Start client

   `npm start`

3. Connect to `localhost:3000` through browser
## Run Server
1. Under `server/RedistrictConnector`, create clean build of server

   `./mvnw clean install`

2. Run server on `localhost:8080`

   `./mvnw spring-boot:run`

3. In MongoDB Compass, connect to `mongodb://localhost:27017`
4. Populate database by running import script in `scripts/`

   `python populate_db_from_zip.py <path to redistricting_db.zip>`
   
## Data Sources
Create `data/` under base project directory and add data from the following sources,
- [CSE 416 Data Google Drive](https://drive.google.com/drive/folders/1LyX8l24IqyiwDo5hlyrxD4R4se2BAPeN?usp=sharing)
### Arizona
- [Arizona vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/arizona-vtd-pl-94171-2020/)
- [Arizona 2020 General Election Results Disaggregated to the 2020 Block](https://redistrictingdatahub.org/dataset/arizona-2020-general-election-results-disaggregated-to-the-2020-block)
- [2020 Census Adjacency Files for Arizona](https://redistrictingdatahub.org/dataset/2020-census-adjacency-files-for-arizona/) (extract only `az_vtd_2020_rook_adjacency.csv`)
- [2022 Arizona State Legislature Districts](https://redistrictingdatahub.org/dataset/2022-arizona-state-legislature-districts-approved-plan/)
### Virginia
- [Virginia vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/virginia-vtd-pl-94171-2020/)
- [Virginia 2020 General Election Results Disaggregated to the 2020 Block](https://redistrictingdatahub.org/dataset/virginia-2020-general-election-results-disaggregated-to-the-2020-block)
- [2020 Census Adjacency Files for Virginia](https://redistrictingdatahub.org/dataset/2020-census-adjacency-files-for-virginia/) (extract only `va_vtd_2020_rook_adjacency.csv`)
- [2021 Virginia House of Delegates Districts](https://redistrictingdatahub.org/dataset/2021-virginia-house-of-delegates-districts-approved-plan/)
### Wisconsin
- [Wisconsin vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/wisconsin-vtd-pl-94171-2020/)
- [Wisconsin 2020 General Election Results Disaggregated to the 2020 Block](https://redistrictingdatahub.org/dataset/wisconsin-2020-general-election-results-disaggregated-to-the-2020-block)
- [2020 Census Adjacency Files for Wisconsin](https://redistrictingdatahub.org/dataset/2020-census-adjacency-files-for-wisconsin/) (extract only `wi_vtd_2020_rook_adjacency.csv`)
- [2022 Wisconsin Senate Districts](https://redistrictingdatahub.org/dataset/2022-wisconsin-senate-districts-approved-plan-2/)
