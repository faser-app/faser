import Cookie from 'js-cookie'
import axios from 'axios'

let userinfo = ref({})

function loadUserInfo() {
    axios
        .get(baseURL + '/api/account/getOwnProfile', {
            headers: {
                token: Cookie.get('token'),
            },
        })
        .then((response) => {
            userinfo.value = response.data
            console.log(userinfo)
        })
}

export default { userinfo, loadUserInfo }
