module.exports = {
	packagerConfig: {
		icon: "./static/icons/Icon",
		executableName: "Boba PCL Viewer",
		appBundleId: "com.bobaprint.pclconverter",
		mac: {
			category: "public.app-category.social-networking",
			darkModeSupport: false,
		},
		dmg: {
			iconSize: 160,
			contents: [
				{
					x: 180,
					y: 170,
				},
				{
					x: 480,
					y: 170,
					type: "link",
					path: "/Applications",
				},
			],
		},
		linux: {
			target: ["deb", "AppImage"],
			category: "Network;Chat",
		},
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	electronPackagerConfig: {
		extendInfo: "./assets/Info.plist",
	},
};
