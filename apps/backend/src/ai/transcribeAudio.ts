const { exec } = require("child_process");
const path = require("path");

function transcribeAudio(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../stt/transcribe.py");

    exec(`python "${scriptPath}" "${filePath}"`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout.trim());
    });
  });
}

module.exports = { transcribeAudio };
