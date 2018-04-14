export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {            
      navigator.geolocation.getCurrentPosition(position => {
        let {longitude, latitude} = position.coords;
        resolve({longitude, latitude});
      });
    } else
      reject({message: 'Turn on geo-location'});
  });
}