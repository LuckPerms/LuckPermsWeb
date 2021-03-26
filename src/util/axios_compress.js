import axios from 'axios';
import pako from 'pako';

function gzip(data, headers) {
  // eslint-disable-next-line no-param-reassign
  headers['Content-Encoding'] = 'gzip';
  return pako.gzip(data);
}

// Returns an axios "config" object with a custom transformRequest for gzip.
export default Object.assign({
  transformRequest: axios.defaults.transformRequest.concat(gzip),
});
