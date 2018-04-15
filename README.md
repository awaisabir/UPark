# U PARK

<div style="text-align:center"><img alt="logo" src="https://github.com/awaisabir/COMP4601-Project/blob/master/client/src/assets/logo.png" /></div>

- Crawled data from the [Open Data Catalogue](https://www.toronto.ca/city-government/data-research-maps/open-data/open-data-catalogue/#75d14c24-3b7e-f344-4412-d8fd41f89455) for Parking Ticket Data and parsed using a [Web Crawler] (https://github.com/bda-research/node-crawler), saving the associated Excel Files in the filesystem.

- Parsed address from Excel files using a custom [CSV Parser](https://github.com/awaisabir/COMP4601-Project/blob/master/server/models/CSVParser.js) that reduces the number of requests needed to make to Mapbox by grouping nearby addresses together and exports data as a JSON object.

- Converted physical addresses to Latitude and Longitude pairs by getting the best result from the Mapbox API.

- Stored the address, latitude, longitude, average price, and the number of tickets to an SQLite database through our [Database Interface](https://github.com/awaisabir/COMP4601-Project/blob/master/server/db/Dbi.js).

- Represented the addresses in terms of a matrix of Latitude and Longitude [Sectors](https://github.com/awaisabir/COMP4601-Project/blob/master/server/models/Sector.js) that are based on the minimum and maximum - [CoordinateManager](https://github.com/awaisabir/COMP4601-Project/blob/master/server/models/CoordinateManager.js) and ran [Collaborative Filtering](https://github.com/awaisabir/COMP4601-Project/blob/master/server/algo/UserBasedCF.js) on the resulting matrix of prices and tickets.
  - If the resulting matrix has more than 90% of unpredictable values, then a wider range for the longitudes and latitudes is used, and the "standard level" is lowered to 75%, and so on, up until a "Matrix of best fit" is computed.

- Based on a longitude and latitude passed in the best 9 computed locations are returned to the user and displayed on a map hosted by [Mapbox](https://github.com/alex3165/react-mapbox-gl) on the [frontend](https://github.com/awaisabir/COMP4601-Project/tree/master/client/src).

#### Created by [Pierre Seguin](https://github.com/pseguin2011) and [awaisabir](https://github.com/awaisabir)
