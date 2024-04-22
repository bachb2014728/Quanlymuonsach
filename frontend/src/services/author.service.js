import createApiClient from "./api.service";
class AuthorsService {
    constructor(baseUrl = "http://localhost:3000/api/v1/authors") {
        this.api = createApiClient(baseUrl);
        this.token = localStorage.getItem('token');
    }
    async getAllAuthors(){
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
    async getOneAuthor(id){
        return (await this.api.get(`/${id}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async updateOneAuthor(id,data){
        return (await this.api.put(`/${id}`,data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }))
    }
    async createOneAuthor(data){
        return (await this.api.post("", data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async deleteOneAuthor(data){
        return (await this.api.delete(`/${data}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
}
export default new AuthorsService();