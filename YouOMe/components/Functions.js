export const snapshotToArray = snapshot => {
    const ret = [];
    snapshot.forEach(childSnapshot => {
        ret.push(childSnapshot);
    });
    return ret;
};