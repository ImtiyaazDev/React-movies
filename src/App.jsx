import { useEffect, useState } from "react";
import Search from "./commponents/Search";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`
	}
};

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchMovies = async function () {
		setIsLoading(true);
		setErrorMessage("");

		try {
			const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
			const res = await fetch(endpoint, API_OPTIONS);

			if (!res.ok) {
				throw new Error("Failed to fetch movies");
			}

			const data = await res.json();

			if (data.Response === "False") {
				setErrorMessage(data.Error || "Failed to fetch movies");
				setMovies([]);
				return;
			}

			setMovies(data.results || []);
		} catch (err) {
			console.error(`Error fetch movies: ${err}`);
			setErrorMessage(`Error fetching movies. Please try again later.`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(function () {
		fetchMovies();
	}, []);

	return (
		<main>
			<div className="pattern" />

			<div className="wrapper">
				<header>
					<h1>
						Find <span className="text-gradient">Movies</span> You'll Enjoy
						Without the Hassle
					</h1>
					<Search
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</header>
				<section className="all-movies">
					<h2>All Movies</h2>

					{isLoading ? (
						<p className="text-white">Loading...</p>
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movies.map((movie, i) => (
								<p
									className="text-white"
									key={i}
								>
									{movie.title}
								</p>
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}
