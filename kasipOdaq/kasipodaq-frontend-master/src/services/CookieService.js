import Cookies from 'react-cookies'

class CookieService {
    static create (name, value) {
        if (CookieService.get(name) !== undefined) {
            CookieService.remove(name)
        }

        Cookies.save(name, value, { path: '/' })
    }

    static get (name) {
        return Cookies.load(name, { path: '/' })
    }

    static remove (name) {
        Cookies.remove(name, { path: '/' })
    }
}

export default CookieService