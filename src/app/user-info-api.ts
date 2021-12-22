import axios from 'axios';
import auth from './auth';


export default {
	getUserInfo(): Promise<any> {
		const jwtToken = auth.auth.getSignInUserSession().getAccessToken().jwtToken;
		const USERINFO_URL = 'https://' + auth.auth.getAppWebDomain() + '/oauth2/userInfo';
		const requestData = {
			headers: {
				'Authorization': 'Bearer ' + jwtToken
			}
		};
		return axios.get(USERINFO_URL, requestData).then(response => {
			return response.data;
		});
	}
}