export default function Search({ searchTerm, setSearchTerm }) {
	return (
		<div className="search">
			<div>
				<img
					src="search.svg"
					alt="Search"
				/>
				<input
					type="text"
					placeholder="Search through thousands of movies"
					value={searchTerm}
					onChange={(e) => e.target.value}
				/>
			</div>
		</div>
	);
}
