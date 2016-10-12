import R from 'ramda';
import fritz from './fritz';
import or from './or-germany';

const sources = { fritz, or };

function get () {
  const r = R.values(sources).map(f => {
    return f()
      .catch(e => {
        console.log('GET Sources error: ', e);
        return [];
      });
  });

  return Promise.all(r).then(result => {
    const concat = (a, r) => a.concat(r);
    const r = R.reduce(concat, [], result);
    return r;
  }).catch(e => {
    console.log(e);
  });
}

export default {
  get
};
