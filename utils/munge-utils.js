export function formatShows(data) {
  
  return data.map(show => {
    if(show.show.image){
      return {
        showId: show.show.id,
        title: show.show.name,
        image: show.show.image.medium,
        rating: show.show.rating.average,
        description: show.show.summary
      };
    } else {
      return  {
        showId: show.show.id,
        title: show.show.name,
        rating: show.show.rating.average,
        description: show.show.summary
      };
    }
    
  });

}