const { dialog, app, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const { is } = require("electron-util");

const getFileByOS = () => {
	if (is.linux) return "gpcl6linux";
	if (is.macos) return "pcl6mac";
	if (is.windows) return "gpcl6win64.exe";
};

const convertPCLtoPDF = ({ inputPath, outputFile }) =>
	new Promise((resolve, reject) => {
		const binariesPath = path.join(__dirname, "bin", getFileByOS());

		console.log("convertPCLtoPDF ", inputPath, outputFile);
		console.log(process.resourcesPath);
		// const gpcl6Binary = path.join(process.resourcesPath, "bin", "mac", "pcl6");
		// console.log(gpcl6Binary)

		const gs = spawn(binariesPath, [
			"-dNOPAUSE",
			"-dQUIET",
			"-dBATCH",
			"-dEmbedAllFonts=true",
			"-sDEVICE=pdfwrite",
			`-sOutputFile=${outputFile}`,
			inputPath,
		]);

		console.log(outputFile);

		gs.stdout.on("data", (data) => {
			console.log(`stdout: ${data}`);
		});

		gs.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
			reject(data);
		});

		gs.on("close", (code) => {
			if (code !== 0) {
				reject(`GhostScript process exited with code ${code}`);
			} else {
				resolve(outputFile);
			}
		});
	});

/**
 *
 * @param {string} filePath
 */
const openItemWithOSDefault = ({ filePath }) => {
	console.log("openItemWithOSDefault", filePath);
	shell.openPath(filePath);
};

const openFileDialog = () =>
	new Promise((resolve, reject) => {
		dialog
			.showOpenDialog({
				properties: ["openFile"],
				filters: [{ name: "PCL", extensions: ["pcl"] }],
			})
			.then(function (response) {
				if (!response.canceled) {
					resolve(response.filePaths[0]);
				} else {
					reject("USER_NOT_SELECT");
				}
			});
	});

exports.convertPCLtoPDF = convertPCLtoPDF;
exports.openItemWithOSDefault = openItemWithOSDefault;
exports.openFileDialog = openFileDialog;
