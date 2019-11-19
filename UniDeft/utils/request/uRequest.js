export default class Request {
	
	// delete
	static delete({url,success,fail,complete}){
		this.request({
			url:url,
			method: 'DELETE',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// patch
	static patch({url,success,fail,complete}){
		this.request({
			url:url,
			method: 'PATCH',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// put
	static put({url,success,fail,complete}){
		this.request({
			url:url,
			method: 'PUT',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	// post
	static post({url,success,fail,complete}){
		console.log(url)
		this.request({
			url:url,
			method: 'POST',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// get
	static get({url,success,fail,complete}){
		this.request({
			url:url,
			method: 'GET',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	// request 
	static request({url,method = "GET",success,fail,complete}){
		const ab_url = 'http://192.168.1.7:3001' + url
		uni.request({
			url: ab_url,
			method:method,
			success:(res) => {
				if(res.statusCode == 200){
					success && (typeof success === 'function')  && success(res.data)
				}else{
					fail && (typeof fail === 'function')  && fail({
						code: -1,
						message: '请求失败'
					})
				}
			},
			fail: err =>{
				fail && (typeof fail === 'function')  && fail({
					code: -1,
					message: JSON.stringify(err)
				})
			},
			complete: ()=>{
				complete && (typeof complete === 'function')  && complete()
			}
		})
	}
}