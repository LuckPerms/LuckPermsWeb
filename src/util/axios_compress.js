import axios from 'axios';
import pako from 'pako';

// Returns an axios "config" object with a custom transformRequest for gzip.
export default Object.assign({
    transformRequest: axios.defaults.transformRequest.concat(
        function (data, headers) {
            headers['Content-Encoding'] = 'gzip';
            return pako.gzip(data);
        },
    ),
})
