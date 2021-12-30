export type Movie = {
	MovieId?: string;
	MovieName?: string;
	AlphabeticalMovieName?: string;
	Own?: boolean;
	OwnFormat?: string;
	Digital?: string;
	Requester?: string;
	RequestTime?: string;
	WatchStatus?: string;
	Wishlist?: boolean;
	WishlistFormat?: string;
	Tags?: Array<string>;
	Notes?: string;
};