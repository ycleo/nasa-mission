const DEFAULT_PAGE_NUMBER = 1; // if page number was not set -> default is only 1 page
const DEFAULT_PAGE_LIMIT = 0; // if page limit was not set -> set it 0 -> mongo will return all documents in the collection

function getPagination (query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return { 
        skip, 
        limit,
    };
}

module.exports = {
    getPagination,
}