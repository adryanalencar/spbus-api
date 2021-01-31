
const API_URL = "http://api.olhovivo.sptrans.com.br/v2.1"
const API_KEY = process.env.SPTRANS_API_KEY
let API_CREDENTIALS = ""

const auth =  async () => {

    const request = await fetch(`${API_URL}/Login/Autenticar?token=${API_KEY}`, {
        method : 'post',
        credentials: 'include'
    })

    const response = request.headers.get('set-cookie')

    return response;
}

const get_vehicles = async (route_id, session_cookie) => {
    const request = await fetch(`${API_URL}/Posicao/Linha?codigoLinha=${route_id}`,{
        headers:{
            "Cookie": session_cookie
        }
    })

    const response = await request.json()

    return response
}

const search_line = async (query, response) => {
    auth().then(async (session_cookie) => {

        const lines = []

        const request = await fetch(`${API_URL}/Linha/Buscar?termosBusca=${query}`, {
            headers:{
                "Cookie": session_cookie
            }
        })
        
        request.json().then((data) => {
            data.map((line, index) => {
                get_vehicles(line.cl, session_cookie).then((vehicle) => {
                    line.vehicles = vehicle
                    lines.push(line)

                    if((index + 1) == data.length){
                        response.json({lines, status: "success"})
                    }

                })
            })
        })



        

    })

    
}

const get_bus = async (request, response) => {
    const bus_key = request.query.bus;

    response.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate')
    response.setHeader('Access-Control-Allow-Origin', '*')

    search_line(bus_key, response)
}

export default get_bus;