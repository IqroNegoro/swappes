export default (ref, cb, unobserve = false) => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(v => {
            if (v.isIntersecting) {
                cb(entries)
                if (unobserve) {
                    observer.unobserve(v.target)
                }
            }
        })
    }, {
        threshold: 1,
        rootMargin: "0px"
    });
    observer.observe(ref)
}