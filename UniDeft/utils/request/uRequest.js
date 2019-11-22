export default class Request {
	
	// delete
	static delete({url,data,success,fail,complete}){
		this.request({
			url:url,
			data,
			method: 'DELETE',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// patch
	static patch({url,data,success,fail,complete}){
		this.request({
			url:url,
			data:data,
			method: 'PATCH',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// put
	static put({url,data,success,fail,complete}){
		this.request({
			url:url,
			data:data,
			method: 'PUT',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	// post
	static post({url,data,success,fail,complete}){
		console.log(url)
		this.request({
			url:url,
			data:data,
			method: 'POST',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	
	// get
	static get({url,data,success,fail,complete}){
		this.request({
			url:url,
			data:data,
			method: 'GET',
			success:success,
			fail:fail,
			complete:complete
		})
	}
	
	// request 
	static request({url,data,method = "GET",success,fail,complete}){
		const ab_url = 'http://localhost:3001' + url
		uni.request({
			url: ab_url,
			method:method,
			data:data,
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