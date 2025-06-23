import { useState } from "react";
import Search from "./commponents/Search";

export default function App() {
	const [searchTerm, setSearchTerm] = useState("");

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
			</div>
		</main>
	);
}
