import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async function (searchTerm, movie) {
	// 1. Use appwrite sdk to check if search term exists in the databse
	try {
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.equal("searchTerm", searchTerm)
		]);

		// 2. If it does, update the count
		if (result.documents.length > 0) {
			const doc = result.documents[0];

			await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
				count: doc.count + 1
			});
			// 3. If it doesn't, create a new doucment with the search term and update the count
		} else {
			await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
				searchTerm,
				count: 1,
				movie_id: movie.id,
				poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
			});
		}
	} catch (err) {
		console.error(err);
	}
};

export const getTrendingMovies = async function () {
	try {
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.limit(5),
			Query.orderDesc("count")
		]);

		return result.documents;
	} catch (err) {
		console.error(err);
	}
};
