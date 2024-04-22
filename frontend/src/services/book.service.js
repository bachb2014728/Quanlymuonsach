import createApiClient from "./api.service";
class BooksService {
    constructor(baseUrl = "http://localhost:3000/api/v1/books") {
        this.api = createApiClient(baseUrl);
        this.token = localStorage.getItem('token');
    }
    async getAllBooks(){
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
    async getOneBook(id){
        return (await this.api.get(`/${id}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async updateOneBook(id,data){
        return (await this.api.put(`/${id}`,data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }))
    }
    async createOneBook(data){
        return (await this.api.post("", data,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
    async deleteOneBook(data){
        console.log(data)
        return (await this.api.delete(`/${data}`,{
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        }));
    }
}
export default new BooksService();