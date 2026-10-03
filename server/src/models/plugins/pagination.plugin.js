const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results
   * @property {number} limit
   * @property {number} page
   * @property {number} totalResults
   * @property {number} totalPages
   *
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc)
   * @param {string} [options.populate] - Populate data fields
   * @param {number} [options.limit] - Maximum number of results per page
   * @param {number} [options.page] - Current page
   * @param {number} [options.offset] - Number of records to skip
   * @param {Object} [options.collation] - Collation options
   * @returns {Promise<QueryResult>}
   */

  schema.statics.paginate = async function (filter = {}, options = {}) {
    let sort = "";

    if (options.sortBy) {
      const sortingCriteria = [];

      options.sortBy.split(",").forEach((sortingOption) => {
        const [key, order] = sortingOption.split(":");

        sortingCriteria.push(
          (order === "desc" ? "-" : "") + key
        );
      });

      sort = sortingCriteria.join(" ");
    } else {
      sort = "-createdAt";
    }

    // String filters
    Object.keys(filter).forEach((key) => {
      if (typeof filter[key] === "string") {
        const escapedString = filter[key].replace(
          /[.*+?^${}()[\]\\]/g,
          "\\$&"
        );

        filter[key] = {
          $regex: escapedString,
          $options: "i",
        };
      }
    });

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;

    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;

    const skip =
      options.offset !== undefined
        ? parseInt(options.offset, 10)
        : (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();

    let docsPromise = this.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (options.collation) {
      docsPromise = docsPromise.collation(options.collation);
    }

    if (options.populate) {
      if (typeof options.populate === "string") {
        options.populate.split(",").forEach((populateOption) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split(".")
              .reverse()
              .reduce(
                (a, b) => ({
                  path: b,
                  populate: a,
                })
              )
          );
        });
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach((populateItem) => {
          docsPromise = docsPromise.populate(populateItem);
        });
      } else if (
        typeof options.populate === "object" &&
        options.populate !== null
      ) {
        docsPromise = docsPromise.populate(options.populate);
      }
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then(
      ([totalResults, results]) => {
        const totalPages = Math.ceil(totalResults / limit);

        return {
          results,
          page,
          limit,
          totalPages,
          totalResults,
        };
      }
    );
  };
};

export default paginate;