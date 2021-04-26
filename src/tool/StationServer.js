import axios from 'axios'

export default class StationServer {
    static Axios = axios.create({
        baseUrl: "http://127.0.0.1:8080"
    })

    static findAll() {
        return StationServer.Axios.get(`/findAll`).then(response => {
            return response.data
        })
    }

    static findPage(param) {
        return StationServer.Axios.post(`/findPage`, param).then(response => {
            return response.data
        })
    }

    static edit({id, name, uid}) {
        return StationServer.Axios.post(`/update`, {id, name, uid}).then(response => {
            return response.data
        })
    }

}