const apiClient = require('axios');
  apiClient = axios.create({
    baseURL: 'http://localhost:5000/todos/note_tags',  /* https://web-production-b8b7.up.railway.app/notes */
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {

    async listNotes() {
        try {
            const response = await apiClient.get('/')
            return response.data
        } catch (error) {
            throw "Error de conexion"
        }
    },
    async findNote(id) {
        try {
            const response = await apiClient.get('/' + id)
            return response.data
        } catch (error) {
            throw "Error de conexion"
        }
    },

    async addNote(elemento) {
        try {
            await apiClient.post('/', elemento);
        } catch (error) {
            throw "Error de conexion"
        }
    },

    async deleteNote(id) {
        try {
            await apiClient.delete("/" + id)
        } catch (error) {
            throw "Error de conexion"
        }
    },

    async updateNote(id, elemento) {
        try {
            await apiClient.put("/" + id, elemento)
        } catch (error) {
            throw "Error de conexion"
        }
    },
    
    async updateStateNote(id, archived) {
        try {
            const update = { "archived": !archived}
           await apiClient.patch("/" + id, update)
             
        } catch (error) {
            throw "Error de conexion"
        }
    }
}