export interface Project {
	image: string;
	alt: string;
	description: string;
	href?: string;
}

export const projects: Project[] = [
	{
		image: "/assets/images/cavecrawler-mapper_banner.png",
		alt: "Cavecrawler Mapper",
		href: "https://qaptivator.github.io/cavecrawler-mapper/",
		description:
			"shows the current path to cavecrawler wood through the tropics maze in the roblox game Lumber Tycoon 2, a Roblox game. likely my most viral project yet because many people in the LT2 Wiki use it. my friend Fizzy helped make all the map variations (credits to WigSteve for the maze map)",
	},
	{
		image: "/assets/images/convenotes_banner.png",
		alt: "Convenotes",
		href: "https://convenotes.com/",
		description:
			"The zero-friction CRM that lives in your chat. originally started as a complex web knowledge base, i pivoted the architecture after two business schools (MindCraft) to solve real friction for entrepreneurs. it features AI-driven message processing, a text-based knowledge base, and a task management system with automated reminders via Agenda, alongside contanct management to grow your network. the repository is available here.",
	},
	{
		image: "/assets/images/plainIMG_banner.png",
		alt: "plainIMG",
		href: "https://github.com/qaptivator/plainimg2",
		description:
			"simple but gets-the-job-done image viewer which is very lightweight, images take up your entire screen AND you can use this to pin/place images over your screen! (personally, i use this every single day)",
	},
	{
		image: "/assets/images/tn_banner.png",
		alt: "Terranations",
		description:
			"(WIP) persistent, global MMO strategy game set on a 1:1 scale Earth. with nations, politics, colony building, real player interactions, trading, wars, laws and so much more. with asynchronous action, allowing for millions of players to be active on one server at the same time. this is my dream game, it is and will be in development for a long time, and it will be my most grand project ever...",
	},
	{
		image: "/assets/images/circloo-companion_banner.png",
		alt: "circloO Companion",
		href: "https://qaptivator.github.io/circloo-companion/",
		description:
			"circloO, what a great game. it took several years off my life- anyway so this is a level browser for a small indie game on google play called circloO. it's a 2d platformer game where you roll around with a circle (you have only two inputs: go right or left). there is also a level editor, so people can upload their levels. after hacking around with the desktop version of this game on steam, i found the endpoints to fetch levels from and made this awesome tool.",
	},
];
