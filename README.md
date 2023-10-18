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

   `npm install`
   
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

   `python import-ensemble-data.py`
   
## Data Sources
Create `data/` under `client/src/` and add data from the following sources,
- [Current state and district plan boundaries](https://drive.google.com/drive/folders/1LyX8l24IqyiwDo5hlyrxD4R4se2BAPeN?usp=sharing)
### Virginia
- [Virginia vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/virginia-vtd-pl-94171-2020/)
- [2020 Virginia precinct boundaries and election results shapefile](https://redistrictingdatahub.org/dataset/vest-2020-virginia-precinct-boundaries-and-election-results-shapefile/)
- [2021 Virginia House of Delegates Districts](https://redistrictingdatahub.org/dataset/2021-virginia-house-of-delegates-districts-approved-plan/)
### Arizona
- [Arizona vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/arizona-vtd-pl-94171-2020/)
- [2020 Arizona precinct and election results](https://redistrictingdatahub.org/dataset/vest-2020-arizona-precinct-and-election-results/)
- [2022 Arizona State Legislature Districts](https://redistrictingdatahub.org/dataset/2022-arizona-state-legislature-districts-approved-plan/)
### Wisconsin
- [Wisconsin vtd PL 94-171 2020](https://redistrictingdatahub.org/dataset/wisconsin-vtd-pl-94171-2020/)
- [2020 Wisconsin precinct and election results](https://redistrictingdatahub.org/dataset/vest-2020-wisconsin-precinct-and-election-results/)
- [2022 Wisconsin Senate Districts](https://redistrictingdatahub.org/dataset/2022-wisconsin-senate-districts-approved-plan-2/)
