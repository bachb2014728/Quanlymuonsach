import createApiClient from "./api.service";
class PublishingService {
    constructor(baseUrl = "http://localhost:3000/api/v1/publishing") {
        this.api = createApiClient(baseUrl);
        this.token = localStorage.getItem('token');
    }
    async getAll(){
        try {
            return (await this.api.get("",{
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }));
        }catch (e) {
            console.log(e.data);
        }
    }
    async getOne(id){
        return (await this.api.get(`/${id}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async updateOne(id,data){
        return (await this.api.put(`/${id}`,data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }))
    }
    async createOne(data){
        return (await this.api.post("", data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async deleteOne(data){
        return (await this.api.delete(`/${data}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
}
export default new PublishingService();