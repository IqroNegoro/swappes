export default filelist => {
    let images = [];
    for (let file of filelist) {
        let src = URL.createObjectURL(file);
        images.push({
            name: file.name,
            src
        });
    }
    return images;
}