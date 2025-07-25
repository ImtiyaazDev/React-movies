import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import { getTrendingMovies, updateSearchCount } from "./appwrite";

import Search from "./commponents/Search";
import Spinner from "./commponents/Spinner";
import MovieCard from "./commponents/MovieCard";

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
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [trendingMovies, setTrendingMovies] = useState([]);

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

	const fetchMovies = async function (query = "") {
		setIsLoading(true);
		setErrorMessage("");

		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

			if (query && data.results.length > 0) {
				await updateSearchCount(query, data.results[0]);
			}
		} catch (err) {
			console.error(`Error fetch movies: ${err}`);
			setErrorMessage(`Error fetching movies. Please try again later.`);
		} finally {
			setIsLoading(false);
		}
	};

	const loadTrendingMovies = async function () {
		try {
			const movies = await getTrendingMovies();
			setTrendingMovies(movies);
		} catch (err) {
			console.error(`Error fetching trending movies: ${err}`);
		}
	};

	useEffect(
		function () {
			fetchMovies(debouncedSearchTerm);
		},
		[debouncedSearchTerm]
	);

	useEffect(function () {
		loadTrendingMovies();
	}, []);

	return (
		<main>
			<div className="pattern" />

			<div className="wrapper">
				<header>
					<img
						src="./hero.png"
						alt="Hero Banner"
					/>
					<h1>
						Find <span className="text-gradient">Movies</span> You'll Enjoy
						Without the Hassle
					</h1>
					<Search
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
				</header>

				{trendingMovies.length > 0 && (
					<section className="trending">
						<h2>Trending Movies</h2>
						<ul>
							{trendingMovies.map((movie, index) => (
								<li key={movie.$id}>
									<p>{index + 1}</p>
									<img
										src={movie.poster_url}
										alt={movie.title}
									/>
								</li>
							))}
						</ul>
					</section>
				)}

				<section className="all-movies">
					<h2>All Movies</h2>

					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movies.map((movie) => (
								<MovieCard
									movie={movie}
									key={movie.id}
								/>
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}
