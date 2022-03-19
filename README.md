# [Rocket Mission](http://18.138.254.161:8000/)
**It is a simulation dashboard for rocket mission control.**

![image](https://user-images.githubusercontent.com/64058170/157267476-718c1432-d902-4d62-bb19-abdb851b8006.png)

## Development Tool
- **Frontend**: React, [Arwes](https://arwes.dev/)
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, Docker, AWS

## APIs used
- [NASA Exoplanet Archive - KOI Table (Cumulative list)](https://exoplanetarchive.ipac.caltech.edu/docs/data.html): To get exoplanet data (kepler_data.csv)
- [SpaceX-API](https://github.com/r-spacex/SpaceX-API): To get SpaceX mission history data

![image](https://user-images.githubusercontent.com/64058170/157365065-a6015113-bd02-46fb-8449-b8374b9b2fea.png)

## [Architecture](https://lucid.app/lucidchart/6b66deba-13ba-45d9-b8a9-a5505d1f7485/edit?invitationId=inv_85396e4a-1c8e-49ea-89a1-5dc8aee832fd)
![image](https://user-images.githubusercontent.com/64058170/159128440-5f4a9f22-cd3a-46c4-b229-58868cfdcb16.png)

## Getting Started
1. Install Node.js 
2. Ceate MongoDB Atlas online
3. Create a `server/.env` file with a `MONGO_URL` property set to your MongoDB connection string
4. `npm install`
5. `npm run deploy` and find the frondend page showing on localhost:8000

## Docker
1. Install Docker
2. `docker build . -t rocket-mission`
3. `docker run -it -p 8000:8000 rocket-mission`
