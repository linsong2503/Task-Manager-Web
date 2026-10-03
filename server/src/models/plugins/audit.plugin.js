// plugins/audit.plugin.js

import { getStore } from "../../utils/asyncLocalStorage.js";

const audit = (schema) => {
  /*
   * Store the original document when it is loaded from MongoDB.
   * This allows us to know what the document looked like before an update.
   */
  schema.post("init", function (doc) {
    doc._originalData = doc.toObject();
  });

  /*
   * Before saving a document:
   * - New document → there is no "before" data.
   * - Existing document → keep the original data.
   *
   * We also store the current request so the post hook
   * can later attach before/after data to req.
   */
  schema.pre("save", async function () {
  this._beforeData = this.isNew
    ? null
    : this._originalData || null;

  const store = getStore();

  if (store?.req) {
    this._req = store.req;
  }
});

  /*
   * After saving:
   * Store the old and new versions on the request.
   *
   * Example:
   * req.before = old task
   * req.after = updated task
   */
  schema.post("save", function (doc) {
    const req = this._req || getStore()?.req;

    if (req) {
      req.before = this._beforeData;
      req.after = doc.toObject();
    }
  });

  /*
   * Before query-based update/delete operations:
   * Find the document before changing or deleting it.
   *
   * Example:
   * PATCH /task/update/:id
   *
   * We need this so the audit log can show:
   *
   * before: { status: "todo" }
   * after:  { status: "completed" }
   */
  schema.pre(
  [
    "updateOne",
    "findOneAndUpdate",
    "findOneAndDelete",
    "deleteOne",
  ],
  async function () {
    try {
      this._beforeData = await this.model
        .findOne(this.getQuery())
        .lean();
    } catch (error) {
      this._beforeData = null;
    }
  }
);

  /*
   * After an update:
   * Save before/after data to the current request.
   *
   * This data can later be used by the audit-log middleware
   * to create an ActionLog document.
   */
  schema.post(
    ["updateOne", "findOneAndUpdate"],
    function (doc, next) {
      const req = getStore()?.req;

      if (req) {
        req.before = this._beforeData;

        req.after = doc
          ? doc.toObject
            ? doc.toObject()
            : doc
          : null;
      }

      if (typeof next === "function") {
        next();
      }
    }
  );

  /*
   * After deleting a document:
   *
   * before = the document that was deleted
   * after  = null
   *
   * This makes the audit log clearly show that
   * the document no longer exists.
   */
  schema.post(
  ["findOneAndDelete", "deleteOne"],
  function (doc) {
    const req = getStore()?.req;

    if (req) {
      req.before =
        this._beforeData ||
        (doc
          ? doc.toObject
            ? doc.toObject()
            : doc
          : null);

      req.after = null;
    }
  }
);
};

export default audit;