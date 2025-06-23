export default function MovieCard({
	movie: {
		title,
		vote_average: voteAverage,
		poster_path: posterPath,
		release_date: releaseDate,
		original_language: originalLanguage
	}
}) {
	return (
		<div className="movie-card">
			<img
				src={
					posterPath
						? `https://image.tmdb.org/t/p/w500/${posterPath}`
						: "/no-movie.png"
				}
				alt={title}
			/>

			<div className="mt-4">
				<h3>{title}</h3>

				<div className="content">
					<div className="rating">
						<img
							src="star.svg"
							alt="Star Icon"
						/>
						<p>{voteAverage ? voteAverage.toFixed(1) : "N/A"}</p>
					</div>
					<span>•</span>
					<p className="lang">{originalLanguage.toUpperCase()}</p>
					<span>•</span>
					<p className="year">
						{releaseDate ? releaseDate.split("-")[0] : "N/A"}
					</p>
				</div>
			</div>
		</div>
	);
}
