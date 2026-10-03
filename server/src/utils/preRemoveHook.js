export const preRemoveHook = (refs) => {
    return async function (next) {
        const id = this._id;
        for (const { model, field } of refs) {
            const exists = await model.exists({ [field]: id });
            if (exists) {
                return next(new Error('Can not delete cuz the data is referenced from elsewhere !'));
            }
        }
        next();
    };
};

