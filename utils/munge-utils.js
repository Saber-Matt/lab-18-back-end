export function formatShows(data) {
  
  return data.map(show => {

    return {
      showId: show.show.id,
      title: show.show.name,
      image: show.show.image.medium,
      rating: show.show.rating.average,
      description: show.show.summary
    };
  });

}