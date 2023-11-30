export default (ref, cb) => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(v => {
            if (v.isIntersecting) {
                cb(entries)
            }
        })
    }, {
        threshold: 1,
        rootMargin: "0px"
    });
    observer.observe(ref)
}