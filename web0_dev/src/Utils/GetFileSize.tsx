const GetFileSize = (size: number) => {
	console.log(size);
	let fileSize = size / 1024;
	let unit = 'KB';
	if (fileSize > 1024) {
		fileSize = fileSize / 1024;
		unit = 'MB';
		if (fileSize > 1024) {
			fileSize = fileSize / 1024;
			unit = 'GB';
			if (fileSize > 1024) {
				fileSize = fileSize / 1024;
				unit = 'TB';
			}
		}
	}
	return fileSize.toFixed(2) + unit;
};

export default GetFileSize;
